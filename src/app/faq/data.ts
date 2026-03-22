export const Data = {
  fr: {
    faq_title: "Centre d'Expertise & FAQ",
    faq_sub: "Réponses techniques et guides pratiques pour les professionnels du commerce et de la création.",
    faqs: [
      {
        q: "Quelle est la différence technique entre un code EAN-13 et un Code 128 ?",
        a: "L'<strong>EAN-13</strong> est un standard international strictement numérique utilisé pour identifier les produits en point de vente (Retail). Il nécessite un enregistrement GS1. Le <strong>Code 128</strong> est beaucoup plus flexible : il est alphanumérique et peut stocker des lettres et des chiffres. C'est l'outil idéal pour la logistique interne, le suivi de colis ou l'inventaire en entrepôt. Vous pouvez générer ces deux formats via notre <a href='/tools/barcode' class='faq-link'>Générateur de Barcode</a> conforme aux normes ISO."
      },
      {
        q: "Pourquoi mon QR Code est-il difficile à scanner une fois imprimé ?",
        a: "La lisibilité d'un QR Code dépend de trois facteurs : le <strong>contraste</strong> (évitez les couleurs trop claires), la <strong>résolution</strong> (privilégiez le format PNG HD) et la <strong>densité des données</strong>. Plus l'URL est longue, plus les carrés sont petits. C'est pourquoi nous recommandons d'utiliser notre <a href='/tools/shortener' class='faq-link'>Réducteur de liens RetailLink</a> avant de générer votre code. Cela simplifie la structure du QR et garantit un scan rapide, même sur de petits supports comme des étiquettes de prix."
      },
      {
        q: "Comment enlever le fond d'une image sans perdre de qualité ?",
        a: "Pour conserver la netteté des contours, il faut utiliser un algorithme de segmentation d'image basé sur l'IA, comme celui de notre outil <a href='/tools/rembg' class='faq-link'>RemBg IA</a>. Contrairement aux outils de détourage manuels qui créent des 'escaliers' sur les pixels, l'IA traite le canal Alpha pour une transparence douce. <strong>Astuce :</strong> Exportez toujours en <strong>PNG</strong> pour conserver cette transparence indispensable à vos fiches produits Shopify ou Amazon."
      },
      {
        q: "Est-il légal d'afficher un prix barré lors des soldes ?",
        a: "Oui, mais c'est très réglementé (Directive Omnibus). Vous devez généralement afficher le prix le plus bas pratiqué au cours des 30 derniers jours. Pour vous aider à respecter ces standards visuels, notre outil <a href='/tools/soldes' class='faq-link'>Étiquettes de Soldes</a> génère automatiquement une mise en page claire avec l'ancien prix barré, le nouveau prix et le code-barres produit, facilitant ainsi la conformité de votre affichage en magasin."
      },
      {
        q: "Comment créer un menu digital pour mon restaurant sans payer d'abonnement ?",
        a: "La méthode la plus efficace est d'héberger votre carte au format PDF sur un stockage cloud (Google Drive) et de transformer le lien de partage en QR Code via notre service <a href='/tools/qrcode' class='faq-link'>QR Pro</a>. L'avantage de RetailBox est que vous pouvez intégrer votre logo au centre du QR, ce qui rassure vos clients et renforce votre identité visuelle par rapport à un code générique."
      },
      {
        q: "Qu'est-ce qu'une VCard et comment l'intégrer dans une stratégie de networking ?",
        a: "Une <strong>VCard (Virtual Contact File)</strong> est un fichier standard compris par 100% des smartphones. En générant un <a href='/tools/vcard' class='faq-link'>QR Code VCard</a>, vous permettez à un prospect d'enregistrer instantanément votre nom, téléphone, email et même votre profil LinkedIn dans son répertoire. C'est l'outil ultime pour remplacer les cartes de visite papier qui finissent souvent à la poubelle."
      },
      {
        q: "Pourquoi choisir un réducteur de liens conforme au RGPD ?",
        a: "La plupart des services comme Bitly stockent l'adresse IP et la localisation de vos clients, ce qui nécessite une déclaration complexe à la CNIL. <a href='/tools/shortener' class='faq-link'>RetailLink</a> a été conçu pour être <strong>Privacy-First</strong> : nous mesurons l'engagement (nombre de clics) de manière totalement anonyme. Aucune donnée personnelle n'est collectée, ce qui sécurise juridiquement votre activité commerciale en Europe."
      },
      {
        q: "Puis-je connecter mes clients au Wi-Fi de ma boutique automatiquement ?",
        a: "Oui, grâce au protocole <strong>WIFI:S:</strong>. En utilisant notre <a href='/tools/wifi' class='faq-link'>Générateur QR Wi-Fi</a>, vous créez un accès crypté. Le client scanne, appuie sur 'Rejoindre', et son téléphone se configure seul. C'est un gain de temps pour vos équipes et un service premium pour vos clients, particulièrement apprécié dans les cafés et salles d'attente."
      },
        {
    q: "Comment fonctionne le QR Code pour les avis Google ?",
    a: "Notre outil identifie votre <strong>Place ID</strong> unique via l'API Google Maps pour générer un lien 'magique'. Contrairement à un lien classique vers votre fiche qui oblige le client à chercher le bouton, notre QR code ouvre <strong>directement la fenêtre de rédaction</strong> avec les 5 étoiles prêtes à être cochées. C'est le moyen le plus efficace pour booster votre SEO local et votre e-réputation en magasin via notre <a href='/tools/google-reviews' class='faq-link'>Booster d'Avis Google</a>."
},
    ]
  },
  en: {
    faq_title: "Expertise Center & FAQ",
    faq_sub: "Technical answers and practical guides for retail and creative professionals.",
    faqs: [
      {
        q: "What is the technical difference between EAN-13 and Code 128 barcodes?",
        a: "<strong>EAN-13</strong> is a numeric-only international standard used for identifying products at retail points of sale. It requires GS1 registration. <strong>Code 128</strong> is much more flexible: it is alphanumeric and can store both letters and numbers. It is the ideal tool for internal logistics, shipment tracking, or warehouse inventory. You can generate both formats using our ISO-compliant <a href='/tools/barcode' class='faq-link'>Barcode Generator</a>."
      },
      {
        q: "Why is my QR Code difficult to scan after printing?",
        a: "Scan reliability depends on three factors: <strong>contrast</strong> (avoid light colors), <strong>resolution</strong> (use HD PNG), and <strong>data density</strong>. Longer URLs result in smaller pixels. This is why we recommend using our <a href='/tools/shortener' class='faq-link'>RetailLink URL Shortener</a> before generating your code. This simplifies the QR structure and ensures a fast scan, even on small price tags."
      },
      {
        q: "How can I remove an image background without losing quality?",
        a: "To maintain edge sharpness, you must use an AI-based image segmentation algorithm like the one in our <a href='/tools/rembg' class='faq-link'>RemBg AI</a> tool. Unlike manual cropping tools that create 'staircase' pixels, the AI processes the Alpha channel for smooth transparency. <strong>Pro Tip:</strong> Always export as <strong>PNG</strong> to preserve this transparency, which is essential for Shopify or Amazon product listings."
      },
      {
        q: "Is it legal to display crossed-out prices during sales?",
        a: "Yes, but it is highly regulated (Omnibus Directive). You generally must display the lowest price offered in the last 30 days. To help you comply with these visual standards, our <a href='/tools/soldes' class='faq-link'>Sale Labels</a> tool automatically generates a professional layout with the crossed-out original price, the new price, and the product barcode."
      },
      {
        q: "How do I create a digital menu for my restaurant for free?",
        a: "The most effective method is to host your menu as a PDF on a cloud service (Google Drive) and transform the public sharing link into a QR Code via our <a href='/tools/qrcode' class='faq-link'>QR Pro</a> service. The advantage of RetailBox is that you can embed your logo in the center of the QR, building customer trust and brand recognition."
      },
      {
        q: "What is a VCard and how can it be used for networking?",
        a: "A <strong>VCard (Virtual Contact File)</strong> is a standard file format recognized by 100% of smartphones. By generating a <a href='/tools/vcard' class='faq-link'>VCard QR Code</a>, you allow a prospect to instantly save your name, phone, email, and even your LinkedIn profile to their address book. It is the ultimate tool to replace paper business cards."
      },
      {
    q: "How does the Google Review QR Code work?",
    a: "Our tool identifies your unique <strong>Place ID</strong> via the Google Maps API to generate a 'magic' link. Unlike a standard link to your business profile that forces customers to search for the review button, our QR code <strong>instantly opens the review form</strong> with 5 stars ready to be selected. It is the most effective way to boost your local SEO and in-store online reputation using our <a href='/tools/google-reviews' class='faq-link'>Google Review Booster</a>."
},
    
    ]
  }
}