export const Data = {
  fr: {
    faq_title: "Centre d'Expertise Technique & FAQ",
    faq_sub: "Analyses approfondies et guides stratégiques pour les professionnels du commerce, de la logistique et du marketing digital.",
    faqs: [
      {
        q: "Quelle est la différence technique entre un code EAN-13 et un Code 128 ?",
        a: "L'<strong>EAN-13</strong> (European Article Number) est le standard mondial pour l'identification des produits de grande consommation. Techniquement, il est composé de 12 chiffres de données et d'un 13ème chiffre de contrôle calculé via l'algorithme Modulo 10. Ce format est strictement numérique et nécessite une licence GS1 pour une utilisation commerciale officielle. À l'opposé, le <strong>Code 128</strong> est une symbologie alphanumérique haute densité capable d'encoder les 128 caractères ASCII. Il est privilégié dans la logistique, le transport et la gestion d'inventaire interne car il permet d'intégrer des informations complexes comme des numéros de lot ou des dates de péremption. Notre <a href='/tools/barcode' class='faq-link'>Générateur de Barcode</a> assure une conformité totale aux normes ISO/IEC pour garantir une lecture laser instantanée par 100% des terminaux de point de vente."
      },
      {
        q: "Pourquoi mon QR Code est-il difficile à scanner après impression ?",
        a: "La fiabilité d'un QR Code repose sur le contraste et la 'Zone de Silence' (marge blanche). Si vous utilisez des couleurs trop proches ou si la résolution d'impression est inférieure à 300 DPI, les capteurs CMOS des smartphones peinent à isoler les modules. Un autre facteur critique est la <strong>densité des données</strong> : plus une URL est longue, plus les points du QR Code sont petits et serrés. Pour optimiser la vitesse de scan, nous vous recommandons d'utiliser notre <a href='/tools/shortener' class='faq-link'>URL Shortener RetailLink</a>. En réduisant la longueur de la chaîne de caractères, vous augmentez la taille physique de chaque pixel du QR Code, ce qui garantit une lecture réussie même sur des supports difficiles (étiquettes de bijoux, vitrines réfléchissantes) ou dans des conditions de faible luminosité."
      },
      {
        q: "Comment garantir la qualité studio d'un détourage d'image par IA ?",
        a: "Le détourage professionnel demande une précision chirurgicale sur les contours. Notre moteur <a href='/tools/rembg' class='faq-link'>RemBg IA</a> s'appuie sur l'architecture de réseaux de neurones profonds <strong>U2-Net</strong>, spécialement entraînée pour la segmentation sémantique d'objets. Contrairement aux méthodes de masquage classiques, cette IA génère un masque de transparence progressif (canal Alpha) qui gère les zones complexes comme les fibres de textile ou les cheveux. Pour un résultat optimal, photographiez vos produits sur un fond relativement uni avec un éclairage diffus pour éviter les ombres portées trop dures. Vous obtiendrez ainsi un fichier <strong>PNG 32-bit transparent</strong> prêt à être intégré sur vos fiches produits Shopify, Vinted ou Amazon, égalant la qualité d'une retouche manuelle coûteuse."
      },
      {
        q: "Quelles sont les obligations de la Directive Omnibus pour les prix barrés ?",
        a: "La réglementation européenne (Directive Omnibus) impose une transparence totale sur les promotions. Le <strong>prix de référence</strong> (prix barré) doit obligatoirement être le prix le plus bas pratiqué par le commerçant au cours des 30 derniers jours précédant la réduction. Cette règle vise à éradiquer les fausses promotions. Notre outil <a href='/tools/soldes' class='faq-link'>Étiquettes de Soldes</a> a été conçu pour respecter cette hiérarchie d'information : il permet d'afficher clairement le prix d'origine, le pourcentage de remise et le prix final. En utilisant nos <strong>planches PDF A4</strong>, vous disposez d'un support conforme aux exigences de la DGCCRF, facilitant la mise en conformité immédiate de votre point de vente tout en offrant une lisibilité maximale pour le consommateur final."
      },
      {
        q: "Comment centraliser ses réseaux sociaux avec une Social Card ?",
        a: "L'<strong>Identité Digitale</strong> (ou Social Card) est la réponse au besoin de marketing omnicanal. Au lieu de diriger vos clients vers un seul site, vous leur offrez un menu interactif regroupant Instagram, TikTok, LinkedIn et votre boutique. Techniquement, cela réduit la friction et la 'fatigue de scan' : un seul QR code sur votre comptoir suffit pour fidéliser vos clients sur toutes vos plateformes. Notre service <a href='/tools/digital-id' class='faq-link'>Identité Digitale</a> génère une page mobile-first ultra-légère qui se charge en moins d'une seconde, garantissant que vous ne perdez aucun visiteur. C'est l'alternative professionnelle aux services comme Linktree, optimisée pour le contact physique et la conversion immédiate en magasin."
      },
      {
        q: "Le format VCard est-il compatible avec tous les smartphones ?",
        a: "Oui, la <strong>VCard (Virtual Contact File)</strong> version 3.0 est le standard universel pour l'échange de coordonnées. Contrairement à une simple image ou du texte, le scan d'un <a href='/tools/vcard' class='faq-link'>QR Code VCard</a> déclenche une action système native sur iPhone et Android. Le téléphone propose immédiatement d'ajouter le contact avec le nom, le téléphone, l'e-mail, la fonction et même l'adresse physique de la boutique pour le guidage GPS. C'est l'outil de networking le plus puissant pour les entrepreneurs : vous transformez une rencontre éphémère en une présence permanente dans le répertoire de votre prospect, tout en évitant les erreurs de saisie manuelle et le gaspillage de cartes papier."
      },
      {
        q: "Quelle est la différence entre un QR Code statique et dynamique ?",
        a: "Un QR Code statique encode les informations directement dans sa structure binaire. Une fois imprimé, le lien ne peut plus être modifié. C'est la solution gratuite proposée par RetailBox, idéale pour les liens permanents. Le QR Code dynamique, quant à lui, utilise une redirection via un serveur (comme notre domaine rtbx.space). Il permet de modifier l'URL de destination (par exemple, changer un menu de restaurant) sans changer le code imprimé. Pour une utilisation pro immédiate, nos codes statiques haute définition offrent une fiabilité maximale et une gratuité totale, tandis que notre gestionnaire de liens vous permet de suivre les statistiques d'engagement pour chaque campagne."
      },
      {
        q: "Pourquoi RetailLink est-il un réducteur d'URL conforme au RGPD ?",
        a: "La conformité au <strong>RGPD</strong> est au cœur de notre architecture. Contrairement aux services comme Bitly qui stockent l'adresse IP, la localisation précise et l'empreinte digitale des navigateurs de vos clients, <a href='/tools/shortener' class='faq-link'>RetailLink</a> pratique la 'minimisation des données'. Nous comptabilisons uniquement l'incrément du clic de manière quantitative. Aucune donnée permettant d'identifier, de pister ou de profiler l'utilisateur final n'est enregistrée dans notre base de données. Cela vous permet d'utiliser nos liens courts dans vos campagnes marketing européennes sans avoir à demander un consentement spécifique lié au tracking, simplifiant ainsi votre conformité juridique tout en protégeant la vie privée de vos clients."
      },
      {
        q: "Comment connecter les clients au Wi-Fi de ma boutique automatiquement ?",
        a: "Nous utilisons le protocole standardisé <strong>WIFI:S:</strong> pour la génération de nos codes. Lorsque vous entrez votre SSID (nom du réseau) et votre clé de sécurité dans notre <a href='/tools/wifi' class='faq-link'>Générateur QR Wi-Fi</a>, nous créons un code crypté que les systèmes iOS et Android lisent nativement. Plus besoin de dictée fastidieuse ou d'erreurs de majuscules : le client scanne, une notification apparaît, et il est connecté. C'est une marque de professionnalisme qui améliore considérablement l'expérience client en point de vente, particulièrement dans les secteurs de la restauration et de la prestation de services où le confort numérique est un critère de fidélisation majeur."
      },
      {
        q: "Comment fonctionne le Booster d'avis Google pour les commerçants ?",
        a: "Notre outil exploite l'<strong>API Google Places</strong> pour identifier le <strong>Place ID</strong> unique de votre établissement. Au lieu de générer un lien vers votre page d'accueil Google Maps, nous construisons une URL 'Deep Link' (writereview). Techniquement, le QR code <a href='/tools/google-reviews' class='faq-link'>Booster d'Avis</a> court-circuite toutes les étapes intermédiaires pour ouvrir directement la fenêtre de notation 5 étoiles sur le smartphone du client. En supprimant la friction (recherche, navigation, clics), vous multipliez par trois vos chances de récolter des avis positifs. C'est la stratégie la plus efficace pour remonter dans le classement local de Google et distancer vos concurrents sur la carte."
      },
      {
        q: "Puis-je imprimer mes étiquettes de prix en masse (Bulk) ?",
        a: "Tout à fait. Nous avons développé une fonctionnalité exclusive de <strong>Planche PDF A4</strong> pour les professionnels. Au lieu de traiter chaque produit individuellement, notre générateur permet de créer un fichier PDF calibré pour les feuilles d'autocollants standards (format 3x8 étiquettes par page). Cette solution vous garantit un alignement millimétré lors de l'impression, évitant le gaspillage de papier. C'est l'outil idéal pour l'étiquetage de nouveaux stocks, la préparation des périodes de soldes ou l'organisation de votre logistique interne avec des codes-barres lisibles et professionnels, le tout accessible directement depuis votre navigateur."
      },
      {
        q: "Quelles sont les garanties de sécurité de la plateforme RetailBox ?",
        a: "La sécurité est la pierre angulaire de notre service. Nous utilisons un <strong>traitement volatile en RAM</strong> : vos photos et saisies techniques sont traitées par nos moteurs de calcul (Next.js/Python) sans jamais être écrites sur un stockage permanent. Une fois le fichier généré et téléchargé, les données sont purgées de la mémoire vive. Pour la gestion de vos liens permanents, nous utilisons l'infrastructure de <strong>Supabase</strong>, protégée par le chiffrement AES-256 et des règles de sécurité au niveau des lignes (RLS). Cette architecture hybride garantit que vous restez le seul propriétaire de vos contenus (UGC) tout en profitant d'une performance cloud haut de gamme."
      }
    ]
  },
  en: {
    faq_title: "Technical Expertise Center & FAQ",
    faq_sub: "Deep technical insights and strategic guides for retail, logistics, and digital marketing professionals.",
    faqs: [
      {
        q: "What is the technical difference between EAN-13 and Code 128 barcodes?",
        a: "The <strong>EAN-13</strong> (European Article Number) is the global standard for consumer product identification at the point of sale. It consists of 12 data digits and a 13th checksum digit calculated using the Modulo 10 algorithm. This format is strictly numeric and requires a GS1 license for official commercial use. In contrast, <strong>Code 128</strong> is a high-density alphanumeric symbology capable of encoding all 128 ASCII characters. It is preferred for internal logistics and warehouse management because it can store complex data such as batch numbers, serial numbers, or bin locations (SKUs) in a compact footprint. Our <a href='/tools/barcode' class='faq-link'>Barcode Generator</a> ensures full compliance with ISO/IEC standards for 100% laser readability across all retail scanners."
      },
      {
        q: "Why is my QR Code unreadable after printing?",
        a: "QR Code reliability depends primarily on contrast and the 'Quiet Zone' (the white margin). If colors are too similar or the printing resolution is below 300 DPI, smartphone sensors will struggle to isolate the data modules. Another critical factor is <strong>data density</strong>: longer URLs create smaller, tighter squares within the QR matrix. To optimize scanning speed, we recommend using our <a href='/tools/shortener' class='faq-link'>RetailLink URL Shortener</a>. By reducing the character string length, you increase the physical size of each module, ensuring a 99% successful scan rate even on difficult materials like jewelry tags, reflective glass, or under dim restaurant lighting."
      },
      {
        q: "How can I ensure studio-quality background removal with AI?",
        a: "Professional image cropping requires pixel-perfect edge detection. Our <a href='/tools/rembg' class='faq-link'>RemBg AI</a> engine utilizes the <strong>U2-Net</strong> deep neural network architecture, specifically trained for semantic object segmentation. Unlike manual masking which creates 'staircase' jagged edges, the AI processes the Alpha channel for soft, realistic transparency around complex areas like hair or fine textures. For best results, photograph products on a solid background with diffused lighting. You will receive a <strong>32-bit transparent PNG</strong> ready for direct integration into Shopify, Amazon, or Vinted listings, matching the quality of expensive manual Photoshop editing."
      },
      {
        q: "Is RetailLink a GDPR-compliant URL shortener?",
        a: "Yes. <strong>GDPR compliance</strong> is built into our core architecture through data minimization. While services like Bitly collect IP addresses, precise geolocations, and browser fingerprints, <a href='/tools/shortener' class='faq-link'>RetailLink</a> uses anonymous audience measurement. We only record a quantitative click increment. No personally identifiable information (PII) is stored in our Supabase database, meaning you don't need specific user consent for tracking when using our short links in Europe. This streamlines your marketing compliance while building trust through respect for customer privacy."
      },
      {
        q: "How does the Google Review Booster work and why does it boost local SEO?",
        a: "Google's <strong>Local Pack</strong> ranking is heavily influenced by the frequency and quality of reviews. The challenge for business owners is capturing reviews at the peak of customer satisfaction. Our tool uses the <strong>Google Places API</strong> to extract your unique <strong>Place ID</strong>. The QR Code generated by our <a href='/tools/google-reviews' class='faq-link'>Review Booster</a> bypasses intermediate profile pages and directly triggers the 'writereview' window. Customers simply tap 5 stars and submit. By removing this technical friction, users see review rates increase by over 40% in one month, which is the most powerful signal to rise in local search results."
      },
      {
        q: "Why is a VCard QR superior to traditional paper business cards?",
        a: "Statistically, 88% of paper business cards are discarded within a week. The issue is information friction: nobody takes the time to manually copy numbers or emails. The <strong>VCard (Virtual Contact File) 3.0</strong> standard used by RetailBox solves this permanently. A simple scan of your <a href='/tools/vcard' class='faq-link'>VCard QR Code</a> instantly opens the contact sheet on the prospect's smartphone. They can save your name, shop details, mobile, email, and LinkedIn link with one tap. It is eco-friendly, involves zero printing costs, and is dynamic: you can update your details and regenerate your code for free whenever needed."
      },
      {
        q: "What is the difference between static and dynamic QR Codes?",
        a: "A static QR Code encodes data directly into its binary structure. Once printed, the destination URL cannot be changed. This is our free offering, perfect for permanent links. A dynamic QR Code uses a server-side redirect (via rtbx.space). It allows you to change the destination URL (e.g., updating a menu) without reprinting physical codes. For immediate use, our high-definition static codes offer maximum reliability and zero cost, while our link manager allows you to track engagement statistics for every campaign."
      },
      {
        q: "How do I automatically connect customers to my shop's Wi-Fi?",
        a: "We utilize the <strong>WIFI:S:</strong> standardized protocol for our code generation. By entering your SSID and security key into our <a href='/tools/wifi' class='faq-link'>Wi-Fi QR Generator</a>, we create an encrypted instruction that iOS and Android systems read natively. Customers scan the code at your counter, tap 'Join,' and their phone configures itself. This saves significant time for your staff and modernizes the customer experience, which is a major factor in customer loyalty for cafes, waiting rooms, and service-based businesses."
      },
      {
        q: "Can I print price tags in bulk with RetailBox?",
        a: "Absolutely. We have developed an exclusive <strong>A4 PDF Sheet</strong> feature for retail professionals. Instead of processing products one by one, our generator creates a PDF file calibrated for standard sticker sheets (3x8 layout). This ensures millimetric alignment during printing and prevents paper waste. It is the perfect tool for labeling new stock arrivals or preparing for seasonal sale periods with professional, shelf-ready barcodes, all accessible directly through your web browser."
      },
      {
        q: "What are the legal requirements for displaying sale prices?",
        a: "Under the <strong>Omnibus Directive</strong> in Europe, price reductions must be transparent. The reference price (the crossed-out price) must generally be the lowest price offered in the last 30 days. Our <a href='/tools/soldes' class='faq-link'>Sale Labels</a> tool helps you comply by generating a clear visual hierarchy: the reference price is crossed out, the new price is highlighted, and an EAN barcode is included. Using our tool ensures total clarity for your customers and compliance with consumer protection agencies like the DGCCRF."
      },
      {
        q: "What security measures are in place at RetailBox?",
        a: "Security is a core pillar of our platform. We use <strong>volatile RAM-based processing</strong>: your photos and technical inputs are processed by our compute engines without ever being written to permanent storage. Once your session ends or the file is downloaded, data is purged from memory. For your permanent short links, we utilize <strong>Supabase</strong> infrastructure, protected by AES-256 encryption and Row Level Security (RLS) policies. This hybrid architecture ensures you remain the sole owner of your content (UGC) while benefiting from premium cloud performance."
      },
      {
        q: "How to group social media links into one QR Code?",
        a: "The <strong>Digital Identity (Social Card)</strong> is the modern answer to omnichannel branding. Instead of cluttering your marketing with multiple QR codes, you generate a single access point for Instagram, TikTok, and your shop. This reduces customer 'decision fatigue.' Our <a href='/tools/digital-id' class='faq-link'>Digital Identity</a> tool creates a lightweight, mobile-optimized page that loads in under a second, ensuring followers find your profiles instantly. It's the pro alternative to Linktree for physical point-of-sale engagement."
      }
    ]
  }
}