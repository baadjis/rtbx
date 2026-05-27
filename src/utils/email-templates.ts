import { LangType } from "@/lib/lang/types";

const theme = {
  primary: '#4f46e5',    // Indigo
  secondary: '#9333ea',  // Violet
  success: '#10b981',    // Émeraude
  text: '#1e293b',
  lightText: '#64748b',
  bg: '#f8fafc',
  white: '#ffffff'
};

const logoUrl = "https://www.rtbx.space/icon.svg";

// --- 0. LE MOULE COMMUN (WRAPPER) ---
const EmailWrapper = (content: string, lang: 'fr' | 'en') => {
  const footer = {
    fr: {
      addr: "RetailBox Engineering — France",
      legal: "Ceci est un e-mail automatique lié à votre activité sur RetailBox.",
      privacy: "Confidentialité", terms: "Conditions"
    },
    en: {
      addr: "RetailBox Engineering — France",
      legal: "This is an automated email related to your activity on RetailBox.",
      privacy: "Privacy", terms: "Terms"
    }
  }[lang];

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${theme.bg};">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px; background-color: ${theme.white}; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
              <!-- HEADER -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%); padding: 40px;">
                  <img src="${logoUrl}" width="48" height="48" alt="Logo" style="display:block; margin-bottom:12px;">
                  <h1 style="color:white; margin:0; font-size:22px; font-weight:800; letter-spacing:-0.5px;">RetailBox Events</h1>
                </td>
              </tr>
              <!-- CONTENT -->
              <tr>
                <td style="padding: 40px; color: ${theme.text}; line-height: 1.7; font-size: 16px;">
                  ${content}
                </td>
              </tr>
              <!-- FOOTER -->
              <tr>
                <td align="center" style="padding: 40px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
                  <p style="color:${theme.lightText}; font-size:11px; font-weight:800; text-transform:uppercase; margin-bottom:8px;">${footer.addr}</p>
                  <p style="color:${theme.lightText}; font-size:11px; margin-bottom:24px;">${footer.legal}</p>
                  <div style="font-size:11px; font-weight:bold;">
                    <a href="https://rtbx.space/privacy" style="color:${theme.primary}; text-decoration:none;">${footer.privacy}</a>
                    <span style="color:#cbd5e1; margin:0 10px;">|</span>
                    <a href="https://rtbx.space/terms" style="color:${theme.primary}; text-decoration:none;">${footer.terms}</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// --- 1. TEMPLATE : INVITATION VIP / RELANCE ---
export const getInvitationEmail = (data: { orgName: string, eventTitle: string, inviteLink: string }, lang: 'fr' | 'en') => {
  const content = {
    fr: `
      <p style="color:${theme.primary}; font-weight:800; text-transform:uppercase; font-size:12px; margin-bottom:8px;">Invitation Exclusive</p>
      <h2 style="font-size:26px; font-weight:800; margin-top:0;">Bonjour,</h2>
      <p><strong>${data.orgName}</strong> a le plaisir de vous inviter à l'événement suivant :</p>
      <div style="margin: 30px 0; padding: 25px; background-color: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0; text-align: center;">
        <span style="font-size: 20px; font-weight: 800; color: ${theme.text};">${data.eventTitle}</span>
      </div>
      <p>Cet événement est accessible uniquement sur invitation. Pour garantir votre accès, veuillez confirmer votre présence via le bouton ci-dessous :</p>
      <div align="center" style="margin-top: 35px;">
        <a href="${data.inviteLink}" style="background-color:${theme.primary}; color:white; padding: 18px 35px; border-radius: 14px; font-weight:800; text-decoration:none; display:inline-block; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);">Réserver ma place gratuite</a>
      </div>
    `,
    en: `
      <p style="color:${theme.primary}; font-weight:800; text-transform:uppercase; font-size:12px; margin-bottom:8px;">Exclusive Invitation</p>
      <h2 style="font-size:26px; font-weight:800; margin-top:0;">Hello,</h2>
      <p><strong>${data.orgName}</strong> is pleased to invite you to the following event:</p>
      <div style="margin: 30px 0; padding: 25px; background-color: #f8fafc; border-radius: 20px; border: 1px solid #e2e8f0; text-align: center;">
        <span style="font-size: 20px; font-weight: 800; color: ${theme.text};">${data.eventTitle}</span>
      </div>
      <p>This event is invitation-only. To secure your access, please confirm your attendance by clicking the button below:</p>
      <div align="center" style="margin-top: 35px;">
        <a href="${data.inviteLink}" style="background-color:${theme.primary}; color:white; padding: 18px 35px; border-radius: 14px; font-weight:800; text-decoration:none; display:inline-block; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);">Claim my free spot</a>
      </div>
    `
  }[lang];
  return EmailWrapper(content, lang);
};

// --- 2. TEMPLATE : CONFIRMATION D'INSCRIPTION ---
export const getConfirmationEmail = (data: { userName: string, eventTitle: string, date: string, location: string }, lang: 'fr' | 'en') => {
  const content = {
    fr: `
      <h2 style="font-size:26px; font-weight:800; margin-top:0; color:${theme.success};">C'est confirmé ! ✅</h2>
      <p>Bonjour ${data.userName},</p>
      <p>Votre inscription pour <strong>${data.eventTitle}</strong> a bien été enregistrée.</p>
      <div style="margin: 30px 0; padding: 25px; background-color: #f0fdf4; border-radius: 20px; border: 1px solid #dcfce7;">
        <p style="margin:0 0 10px 0;"><strong>📅 Date :</strong> ${data.date}</p>
        <p style="margin:0;"><strong>📍 Lieu :</strong> ${data.location}</p>
      </div>
      <p>Vous recevrez votre badge d'accès QR Code par e-mail quelques jours avant l'événement. Vous pourrez également le retrouver dans votre Wallet RetailBox.</p>
    `,
    en: `
      <h2 style="font-size:26px; font-weight:800; margin-top:0; color:${theme.success};">You're in! ✅</h2>
      <p>Hello ${data.userName},</p>
      <p>Your registration for <strong>${data.eventTitle}</strong> has been successfully confirmed.</p>
      <div style="margin: 30px 0; padding: 25px; background-color: #f0fdf4; border-radius: 20px; border: 1px solid #dcfce7;">
        <p style="margin:0 0 10px 0;"><strong>📅 Date:</strong> ${data.date}</p>
        <p style="margin:0;"><strong>📍 Location:</strong> ${data.location}</p>
      </div>
      <p>You will receive your QR Code access badge by email a few days before the event. You can also find it in your RetailBox Wallet.</p>
    `
  }[lang];
  return EmailWrapper(content, lang);
};

// --- 3. TEMPLATE : ENVOI DE BADGE (TICKET) ---
export const getBadgeDeliveryEmail = (data: { userName: string, eventTitle: string, ticketCode: string }, lang: 'fr' | 'en') => {
  const content = {
    fr: `
      <h2 style="font-size:26px; font-weight:800; margin-top:0;">Votre Badge d'Accès 🎫</h2>
      <p>Bonjour ${data.userName},</p>
      <p>L'événement <strong>${data.eventTitle}</strong> approche !</p>
      <p>Veuillez trouver votre badge d'accès en pièce jointe de ce mail. Nous vous conseillons de le télécharger sur votre téléphone pour faciliter votre entrée.</p>
      <div style="text-align:center; margin: 30px 0; padding: 20px; border: 2px dashed #cbd5e1; border-radius: 20px;">
        <p style="margin:0; font-size:12px; font-weight:bold; color:${theme.lightText}; text-transform:uppercase;">ID Ticket</p>
        <p style="margin:5px 0 0 0; font-size:24px; font-weight:900; color:${theme.primary}; letter-spacing:2px;">${data.ticketCode}</p>
      </div>
      <p style="font-size:14px; color:${theme.lightText};">Le QR Code présent sur le badge sera scanné par l'organisateur à votre arrivée.</p>
    `,
    en: `
      <h2 style="font-size:26px; font-weight:800; margin-top:0;">Your Access Badge 🎫</h2>
      <p>Hello ${data.userName},</p>
      <p>The event <strong>${data.eventTitle}</strong> is coming up soon!</p>
      <p>Please find your access badge attached to this email. We recommend downloading it to your phone for a smooth check-in process.</p>
      <div style="text-align:center; margin: 30px 0; padding: 20px; border: 2px dashed #cbd5e1; border-radius: 20px;">
        <p style="margin:0; font-size:12px; font-weight:bold; color:${theme.lightText}; text-transform:uppercase;">Ticket ID</p>
        <p style="margin:5px 0 0 0; font-size:24px; font-weight:900; color:${theme.primary}; letter-spacing:2px;">${data.ticketCode}</p>
      </div>
      <p style="font-size:14px; color:${theme.lightText};">The QR Code on the badge will be scanned by the organizer upon your arrival.</p>
    `
  }[lang];
  return EmailWrapper(content, lang);
};

export const getSupportEmail = (userName: string, message: string, lang: 'fr' | 'en') => {
  const content = {
    fr: `
      <h2 style="margin-top: 0; font-weight: 800; font-size: 22px;">Nous avons bien reçu votre message</h2>
      <p>Bonjour ${userName},</p>
      <p>Merci d'avoir contacté le support RetailBox. Nous avons bien reçu votre demande et notre équipe technique l'analyse actuellement.</p>
      <div style="border-left: 4px solid ${theme.primary}; padding-left: 20px; color: ${theme.lightText}; margin: 30px 0; font-style: italic;">
        "${message}"
      </div>
      <p>Nous reviendrons vers vous sous 48 heures ouvrées.</p>
    `,
    en: `
      <h2 style="margin-top: 0; font-weight: 800; font-size: 22px;">We've received your message</h2>
      <p>Hello ${userName},</p>
      <p>Thank you for reaching out to RetailBox Support. We have received your request and our technical team is currently reviewing it.</p>
      <div style="border-left: 4px solid ${theme.primary}; padding-left: 20px; color: ${theme.lightText}; margin: 30px 0; font-style: italic;">
        "${message}"
      </div>
      <p>We will get back to you within 48 business hours.</p>
    `
  }[lang];

  return EmailWrapper(content, lang);
};

// --- TEMPLATE : INVITATION AU SONDAGE ---
export const getFormInvitationEmail = (data: { orgName: string, formTitle: string, formLink: string }, lang: 'fr' | 'en') => {
  const content = {
    fr: `
      <p style="color:${theme.primary}; font-weight:800; text-transform:uppercase; font-size:12px; margin-bottom:8px;">Votre avis nous aide</p>
      <h2 style="font-size:24px; font-weight:800; margin-top:0;">Bonjour,</h2>
      <p><strong>${data.orgName}</strong> aimerait recueillir votre avis concernant :</p>
      <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
        <span style="font-size: 18px; font-weight: 800; color: ${theme.text};">${data.formTitle}</span>
      </div>
      <p>Cela ne vous prendra que quelques instants et nous permettra d'améliorer la qualité de nos services.</p>
      <div align="center" style="margin-top: 30px;">
        <a href="${data.formLink}" style="background-color:${theme.primary}; color:white; padding: 16px 30px; border-radius: 12px; font-weight:800; text-decoration:none; display:inline-block; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.15);">Répondre au questionnaire</a>
      </div>
    `,
    en: `
      <p style="color:${theme.primary}; font-weight:800; text-transform:uppercase; font-size:12px; margin-bottom:8px;">We Value Your Feedback</p>
      <h2 style="font-size:24px; font-weight:800; margin-top:0;">Hello,</h2>
      <p><strong>${data.orgName}</strong> would like to get your thoughts on:</p>
      <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
        <span style="font-size: 18px; font-weight: 800; color: ${theme.text};">${data.formTitle}</span>
      </div>
      <p>It will only take a few moments and can be helpfull us improve our service quality for you.</p>
      <div align="center" style="margin-top: 30px;">
        <a href="${data.formLink}" style="background-color:${theme.primary}; color:white; padding: 16px 30px; border-radius: 12px; font-weight:800; text-decoration:none; display:inline-block; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.15);">Take the survey</a>
      </div>
    `
  }[lang];
  return EmailWrapper(content, lang);
};

// --- TEMPLATE : BIENVENUE SPACE ---
export const getSpaceWelcomeEmail = (
  data: {
    displayName: string
    slug: string
    spaceId: string
    editUrl: string
    publicUrl: string
    onboardingUrl: string
  },
  lang: LangType
) => {

  const content = {

    fr: `
      <h2 style="color:#4f46e5; margin-bottom:12px;">
        Félicitations, votre Space est maintenant actif 🚀
      </h2>

      <p>
        Bonjour <strong>${data.displayName}</strong>,
      </p>

      <p>
        Votre identité publique RetailBox a été créée avec succès.
      </p>

      <div style="
        margin:30px 0;
        padding:28px;
        background:linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%);
        border-radius:24px;
        border:1px solid #e0e7ff;
      ">

        <p style="
          margin:0 0 10px 0;
          font-size:11px;
          font-weight:800;
          color:#6366f1;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Votre espace public
        </p>

        <a
          href="${data.publicUrl}"
          style="
            font-size:20px;
            font-weight:800;
            color:#4f46e5;
            text-decoration:none;
            word-break:break-all;
          "
        >
          ${data.publicUrl.replace('https://', '')}
        </a>


        

      </div>

      <div style="
        margin:30px 0;
        padding:25px;
        background-color:#f8fafc;
        border-radius:20px;
        border:1px solid #e2e8f0;
      ">

        <p style="
          margin:0;
          font-size:11px;
          font-weight:800;
          color:#64748b;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Informations de gestion
        </p>

        <div style="
          margin-top:14px;
          font-size:14px;
          color:#1e293b;
          line-height:1.8;
        ">
          <strong>Space ID :</strong>

          <code style="
            background:#e2e8f0;
            padding:3px 8px;
            border-radius:8px;
          ">
            ${data.spaceId}
          </code>

          <br/>

          <strong>Lien d’édition :</strong>

          <a
            href="${data.editUrl}"
            style="
              color:#4f46e5;
              font-weight:700;
              text-decoration:none;
            "
          >
            Gérer mon Space →
          </a>
          
          <br/>

          <a href="${data.onboardingUrl}">
             Commencer la configuration →
           </a>


        </div>

      </div>

      <div style="
        margin-top:30px;
        padding:18px;
        border-radius:16px;
        background:#fff7ed;
        border:1px solid #fed7aa;
      ">
        <p style="
          margin:0;
          font-size:12px;
          color:#9a3412;
          line-height:1.7;
        ">
          Conservez cet e-mail en sécurité.
          Le lien d’édition est privé et permet de gérer votre Space sans compte utilisateur.
        </p>
      </div>
    `,

    en: `
      <h2 style="color:#4f46e5; margin-bottom:12px;">
        Congratulations, your Space is now live 🚀
      </h2>

      <p>
        Hello <strong>${data.displayName}</strong>,
      </p>

      <p>
        Your RetailBox public identity has been successfully created.
      </p>

      <div style="
        margin:30px 0;
        padding:28px;
        background:linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%);
        border-radius:24px;
        border:1px solid #e0e7ff;
      ">

        <p style="
          margin:0 0 10px 0;
          font-size:11px;
          font-weight:800;
          color:#6366f1;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Your public space
        </p>

        <a
          href="${data.publicUrl}"
          style="
            font-size:20px;
            font-weight:800;
            color:#4f46e5;
            text-decoration:none;
            word-break:break-all;
          "
        >
          ${data.publicUrl.replace('https://', '')}
        </a>

      </div>

      <div style="
        margin:30px 0;
        padding:25px;
        background-color:#f8fafc;
        border-radius:20px;
        border:1px solid #e2e8f0;
      ">

        <p style="
          margin:0;
          font-size:11px;
          font-weight:800;
          color:#64748b;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Management details
        </p>

        <div style="
          margin-top:14px;
          font-size:14px;
          color:#1e293b;
          line-height:1.8;
        ">
          <strong>Space ID:</strong>

          <code style="
            background:#e2e8f0;
            padding:3px 8px;
            border-radius:8px;
          ">
            ${data.spaceId}
          </code>

          <br/>

          <strong>Edit link:</strong>

          <a
            href="${data.editUrl}"
            style="
              color:#4f46e5;
              font-weight:700;
              text-decoration:none;
            "
          >
            Manage my Space →
          </a>

            <br/>

            <a href="${data.onboardingUrl}">
              Configure my Space →
            </a>
        </div>

      </div>

      <div style="
        margin-top:30px;
        padding:18px;
        border-radius:16px;
        background:#fff7ed;
        border:1px solid #fed7aa;
      ">
        <p style="
          margin:0;
          font-size:12px;
          color:#9a3412;
          line-height:1.7;
        ">
          Keep this email safe.
          The edit link is private and allows you to manage your Space without a user account.
        </p>
      </div>
    `

  }[lang]

  return EmailWrapper(content, lang)
}

// --- TEMPLATE : ANNULATION D'ÉVÉNEMENT ---
export const getEventCancellationEmail = (
  data: { eventTitle: string; reason?: string },
  lang: 'fr' | 'en'
) => {
  const content = {
    fr: `
      <h2 style="font-size:26px; font-weight:800; margin-top:0; color:#ef4444;">Événement annulé 😔</h2>
      <p>Bonjour,</p>
      <p>Nous vous informons que l'événement suivant a été annulé par l'organisateur :</p>
      <div style="margin: 30px 0; padding: 25px; background-color: #fef2f2; border-radius: 20px; border: 1px solid #fecaca; text-align: center;">
        <span style="font-size: 20px; font-weight: 800; color: ${theme.text};">${data.eventTitle}</span>
      </div>
      ${data.reason ? `
      <div style="margin: 20px 0; padding: 20px; border-left: 4px solid #ef4444; background-color: #fff5f5; border-radius: 0 12px 12px 0;">
        <p style="margin:0; font-size:13px; font-weight:800; color:#ef4444; text-transform:uppercase; margin-bottom:6px;">Raison</p>
        <p style="margin:0; color:${theme.text};">${data.reason}</p>
      </div>` : ''}
      <p>Nous sommes désolés pour la gêne occasionnée. Si vous avez des questions, n'hésitez pas à contacter l'organisateur.</p>
    `,
    en: `
      <h2 style="font-size:26px; font-weight:800; margin-top:0; color:#ef4444;">Event Cancelled 😔</h2>
      <p>Hello,</p>
      <p>We're letting you know that the following event has been cancelled by the organizer:</p>
      <div style="margin: 30px 0; padding: 25px; background-color: #fef2f2; border-radius: 20px; border: 1px solid #fecaca; text-align: center;">
        <span style="font-size: 20px; font-weight: 800; color: ${theme.text};">${data.eventTitle}</span>
      </div>
      ${data.reason ? `
      <div style="margin: 20px 0; padding: 20px; border-left: 4px solid #ef4444; background-color: #fff5f5; border-radius: 0 12px 12px 0;">
        <p style="margin:0; font-size:13px; font-weight:800; color:#ef4444; text-transform:uppercase; margin-bottom:6px;">Reason</p>
        <p style="margin:0; color:${theme.text};">${data.reason}</p>
      </div>` : ''}
      <p>We apologize for any inconvenience. If you have any questions, please reach out to the organizer directly.</p>
    `
  }[lang];
  return EmailWrapper(content, lang);
};
