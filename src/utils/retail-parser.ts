/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from 'papaparse';

// 1. Définition des champs que RetailBox sait gérer
export type StandardField = 'email' | 'first_name' | 'last_name' | 'full_name' | 'phone' | 'company' | 'ignore';

// 2. Dictionnaire de correspondance (pour deviner les colonnes)
const FIELD_MAPS: Record<StandardField, string[]> = {
  email: ['email', 'mail', 'mél', 'e-mail', 'adresse'],
  first_name: ['prénom', 'prenom', 'firstname', 'first name'],
  last_name: ['nom', 'lastname', 'last name', 'surname'],
  full_name: ['nom complet', 'fullname', 'full name', 'identity', 'client'],
  phone: ['tel', 'téléphone', 'phone', 'mobile', 'portable', 'gsm'],
  company: ['entreprise', 'raison sociale', 'company', 'société', 'boutique'],
  ignore: []
};

/**
 * MOTEUR DE PARSING UNIVERSEL
 */
export const RetailParser = {
  
  // A. Transformer le texte brut en tableau d'objets
  parseRawText: (text: string): Promise<any[]> => {
    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true, // On essaie de lire la première ligne comme en-tête
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results.data);
        }
      });
    });
  },

  // B. Deviner à quoi correspond chaque colonne du fichier
  guessMapping: (headers: string[]): Record<string, StandardField> => {
    const mapping: Record<string, StandardField> = {};

    headers.forEach(header => {
      const cleanHeader = header.toLowerCase().trim();
      let found: StandardField = 'ignore';

      // On boucle sur notre dictionnaire pour trouver un match
      (Object.keys(FIELD_MAPS) as StandardField[]).forEach(field => {
        if (FIELD_MAPS[field].some(alias => cleanHeader.includes(alias))) {
          found = field;
        }
      });

      mapping[header] = found;
    });

    return mapping;
  },

  // C. Valider et Nettoyer une ligne
  validateAndClean: (data: any[], mapping: Record<string, StandardField>, requiredFields: StandardField[]) => {
    const cleanedData: any[] = [];
    const errors: string[] = [];
    const seenEmails = new Set();

    data.forEach((row, index) => {
      const entry: any = {};
      
      // On applique le mapping
      Object.keys(mapping).forEach(originalKey => {
        const targetField = mapping[originalKey];
        if (targetField !== 'ignore') {
          entry[targetField] = row[originalKey];
        }
      });

      // Nettoyage Email
      if (entry.email) {
        entry.email = entry.email.toString().toLowerCase().trim();
      }

      // Vérification des champs requis
      let hasMissing = false;
      requiredFields.forEach(field => {
        if (!entry[field]) hasMissing = true;
      });

      // Gestion des doublons et erreurs
      if (hasMissing) {
        errors.push(`Ligne ${index + 1}: Données manquantes`);
      } else if (entry.email && seenEmails.has(entry.email)) {
        // On ignore le doublon silencieusement ou on log
      } else {
        if (entry.email) seenEmails.add(entry.email);
        cleanedData.push(entry);
      }
    });

    return { data:cleanedData, errors };
  }
};