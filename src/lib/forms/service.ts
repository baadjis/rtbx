/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/forms/service.ts
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { getFormInvitationEmail } from '@/utils/email-templates';
import {
  formCreateSchema, formUpdateSchema, formPublishSchema,
  sendFormInviteSchema, formSubmitSchema, formSearchSchema,
} from './validators';
import type {
  FormCreateInput, FormUpdateInput, FormPublishInput,
  SendFormInviteInput, FormSubmitInput, FormSearchInput,
} from './validators';

const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================================================
   CREATE FORM
========================================================= */
export async function createForm(payload: FormCreateInput & { user_id: string }) {
  const supabase = await createClient();
  const parsed = formCreateSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { data, error } = await supabase
    .from('forms')
    .insert([{ ...parsed.data, user_id: payload.user_id }])
    .select('id')
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   UPDATE FORM
========================================================= */
export async function updateForm(
  formId: string,
  payload: FormUpdateInput,
  user_id: string
) {
  const supabase = await createClient();
  const parsed = formUpdateSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { data, error } = await supabase
    .from('forms')
    .update(parsed.data)
    .eq('id', formId)
    .eq('user_id', user_id)
    .select()
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   DELETE FORM
========================================================= */
export async function deleteForm(formId: string, user_id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId)
    .eq('user_id', user_id);

  if (error) return { data: null, error };
  return { data: { deleted: true }, error: null };
}

/* =========================================================
   PUBLISH FORM
========================================================= */
export async function publishForm(payload: FormPublishInput & { user_id: string }) {
  const supabase = await createClient();
  const parsed = formPublishSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { data: form, error: formErr } = await supabase
    .from('forms')
    .update({ is_published: true })
    .eq('id', parsed.data.formId)
    .eq('user_id', payload.user_id)
    .select()
    .single();

  if (formErr) return { data: null, error: formErr };

  // Envoyer les invitations en attente
  const { data: pending } = await supabase
    .from('form_invitations')
    .select('*')
    .eq('form_id', parsed.data.formId)
    .eq('status', 'pending');

  let sentCount = 0;
  if (pending && pending.length > 0) {
    for (const invite of pending) {
      try {
        const link = `https://www.rtbx.space/f/${form.id}?token=${invite.token}&origin=mail_invite`;
        const html = getFormInvitationEmail({
          orgName: form.org_name || 'RetailBox',
          formTitle: form.title,
          formLink: link,
        }, parsed.data.lang);

        await resend.emails.send({
          from: 'RetailBox Forms <forms@rtbx.space>',
          to: invite.email,
          subject: parsed.data.lang === 'fr'
            ? `Votre avis : ${form.title}`
            : `Your feedback: ${form.title}`,
          html,
        });

        await supabase
          .from('form_invitations')
          .update({ status: 'sent' })
          .eq('id', invite.id);

        sentCount++;
      } catch (e) {
        console.error(`Erreur envoi à ${invite.email}`, e);
      }
    }
  }

  return { data: { form, invitationsSent: sentCount }, error: null };
}

/* =========================================================
   SEND FORM INVITES
========================================================= */
export async function sendFormInvites(
  payload: SendFormInviteInput & { user_id: string }
) {
  const supabase = await createClient();
  const parsed = sendFormInviteSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { formId, emails, lang } = parsed.data;

  // Vérifier ownership
  const { data: form } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('user_id', payload.user_id)
    .single();

  if (!form) return { data: null, error: 'Form not found or unauthorized' };

  const link = `https://www.rtbx.space/f/${form.id}?origin=email_invite`;
  const html = getFormInvitationEmail({
    orgName: form.org_name || 'RetailBox',
    formTitle: form.title,
    formLink: link,
  }, lang);

  const { error } = await resend.emails.send({
    from: `${form.org_name || 'RetailBox'} via RetailBox Forms <forms@rtbx.space>`,
    to: emails,
    subject: lang === 'fr'
      ? `Votre avis nous intéresse : ${form.title}`
      : `We value your feedback: ${form.title}`,
    html,
  });

  if (error) return { data: null, error: error.message };
  return { data: { sent: emails.length }, error: null };
}

/* =========================================================
   SUBMIT FORM RESPONSE
========================================================= */
export async function submitFormResponse(
  formId: string,
  payload: FormSubmitInput
) {
  const supabase = await createClient();
  const parsed = formSubmitSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  // Vérifier que le form existe et est actif
  const { data: form } = await supabase
    .from('forms')
    .select('settings, is_published')
    .eq('id', formId)
    .single();

  if (!form) return { data: null, error: 'Form not found' };
  if (!form.is_published || form.settings?.active === false) {
    return { data: null, error: 'Form is not accepting responses' };
  }

  const { error } = await supabase
    .from('form_responses')
    .insert([{
      form_id: formId,
      answers_json: parsed.data.answers,
      origin: parsed.data.origin,
      metadata: parsed.data.metadata,
    }]);

  if (error) return { data: null, error };
  return { data: { submitted: true }, error: null };
}

/* =========================================================
   GET MY FORMS
========================================================= */
export async function getMyForms(user_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('forms')
    .select('id, title, description, category, is_published, visibility, org_name, created_at')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   GET FORM RESPONSES
========================================================= */
export async function getFormResponses(formId: string, user_id: string) {
  const supabase = await createClient();

  // Vérifier ownership
  const { data: form } = await supabase
    .from('forms')
    .select('id')
    .eq('id', formId)
    .eq('user_id', user_id)
    .single();

  if (!form) return { data: null, error: 'Form not found or unauthorized' };

  const { data, error } = await supabase
    .from('form_responses')
    .select('*')
    .eq('form_id', formId)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };
  return { data, error: null };
}

/* =========================================================
   SEARCH FORMS
========================================================= */
export async function searchForms(payload: FormSearchInput) {
  const supabase = await createClient();
  const parsed = formSearchSchema.safeParse(payload);
  if (!parsed.success) return { data: null, error: parsed.error.flatten() };

  const { q, category, limit, offset } = parsed.data;

  let query = supabase
    .from('forms')
    .select('id, title, description, category, org_name, created_at', { count: 'exact' })
    .eq('is_published', true)
    .eq('visibility', 'public');

  if (q) query = query.ilike('title', `%${q}%`);
  if (category) query = query.eq('category', category);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { data: null, error };
  return { data, count, error: null };
}


/* =========================================================
   GET FORM BY ID
========================================================= */
export async function getFormById(formId: string, user_id?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single();

  if (error || !data) return { data: null, error: 'Form not found' };

  // Si form privé — vérifier ownership
  if (data.visibility === 'private' && data.user_id !== user_id) {
    return { data: null, error: 'Unauthorized' };
  }

  return { data, error: null };
}