/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export type StandardField = 'email' | 'first_name' | 'last_name' | 'full_name' | 'phone' | 'company' | 'role' | 'ignore';

const FIELD_MAPS: Record<StandardField, string[]> = {
  email: ['email', 'mail', 'mél', 'e-mail', 'adresse'],
  first_name: ['prénom', 'prenom', 'firstname', 'first name'],
  last_name: ['nom', 'lastname', 'last name', 'surname'],
  full_name: ['nom complet', 'fullname', 'full name', 'identity', 'client'],
  phone: ['tel', 'téléphone', 'phone', 'mobile', 'portable', 'gsm'],
  company: ['entreprise', 'raison sociale', 'company', 'société', 'boutique'],
  role: ['role', 'poste', 'fonction', 'titre', 'job', 'position', 'status'],
  ignore: []
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // Limite de 2 Mo pour la sécurité

export const RetailParser = {
  // Parsing de texte brut (Copier-coller)
  parseRawText: (text: string): Promise<any[]> => {
    return new Promise((resolve) => {
      Papa.parse(text.trim(), {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => resolve(results.data)
      });
    });
  },

  // Parsing de fichier (Excel, CSV, JSON, TXT)
  parseFile: (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      // 1. Vérification de la taille
      if (file.size > MAX_FILE_SIZE) {
        return reject("Fichier trop volumineux (Maximum 2 Mo)");
      }

      const reader = new FileReader();
      const extension = file.name.split('.').pop()?.toLowerCase();

      // 2. Vérification de l'extension
      const allowed = ['csv', 'xlsx', 'xls', 'json', 'txt'];
      if (!extension || !allowed.includes(extension)) {
        return reject("Format non supporté (Utilisez CSV, Excel, JSON ou TXT)");
      }

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          
          if (extension === 'json') {
            const json = JSON.parse(data as string);
            resolve(Array.isArray(json) ? json : [json]);
          } 
          else if (extension === 'csv' || extension === 'txt') {
            Papa.parse(data as string, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => resolve(results.data)
            });
          } 
          else {
            // Excel (.xlsx, .xls)
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            resolve(json);
          }
        } catch (err) {
          reject("Erreur lors de la lecture du fichier. Vérifiez le format.");
        }
      };

      if (extension === 'xlsx' || extension === 'xls') {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    });
  },

  guessMapping: (headers: string[]): Record<string, StandardField> => {
    const mapping: Record<string, StandardField> = {};
    headers.forEach(header => {
      const cleanHeader = header.toLowerCase().trim();
      let found: StandardField = 'ignore';
      (Object.keys(FIELD_MAPS) as StandardField[]).forEach(field => {
        if (FIELD_MAPS[field].some(alias => cleanHeader.includes(alias))) found = field;
      });
      mapping[header] = found;
    });
    return mapping;
  },

  validateAndClean: (data: any[], mapping: Record<string, StandardField>, requiredFields: StandardField[]) => {
    const cleanedData: any[] = [];
    const errors: string[] = [];
    const seenEmails = new Set();

    data.forEach((row, index) => {
      const entry: any = {};
      Object.keys(mapping).forEach(originalKey => {
        const targetField = mapping[originalKey];
        if (targetField !== 'ignore') entry[targetField] = row[originalKey];
      });

      if (entry.email) entry.email = String(entry.email).toLowerCase().trim();

      let hasMissing = false;
      requiredFields.forEach(field => { if (!entry[field]) hasMissing = true; });

      if (hasMissing) errors.push(`Ligne ${index + 1}: Données obligatoires manquantes`);
      else if (entry.email && seenEmails.has(entry.email)) {} 
      else {
        if (entry.email) seenEmails.add(entry.email);
        cleanedData.push(entry);
      }
    });

    return { data: cleanedData, errors };
  }
};