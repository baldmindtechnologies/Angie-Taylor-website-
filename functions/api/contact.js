export async function onRequestPost(context) {
  const form = await context.request.formData();
  const name = String(form.get("name") || "").trim();
  const replyTo = String(form.get("email") || "").trim();
  const subject = String(form.get("subject") || "Website contact").trim();
  const message = String(form.get("message") || "").trim();

  if (!name || !replyTo || !message) {
    return new Response("Please complete the required fields.", { status: 400 });
  }

  // Destination address is stored as a Cloudflare secret, not exposed in page HTML.
  // Bind CONTACT_EMAIL to angietaylorbooking@gmail.com in Cloudflare.
  // Bind SEND_EMAIL to a Cloudflare Email Routing / email-sending service binding.
  const to = context.env.CONTACT_EMAIL;
  if (!to) return new Response("Contact form is not configured yet.", { status: 503 });

  // This endpoint is ready for the email binding during deployment.
  // Until SEND_EMAIL is configured, fail safely instead of exposing the destination.
  if (!context.env.SEND_EMAIL) {
    return new Response("Contact form email delivery is not configured yet.", { status: 503 });
  }

  await context.env.SEND_EMAIL.send({
    to,
    from: to,
    replyTo,
    subject: `[AngieTaylor.com] ${subject}`,
    text: `Name: ${name}\nEmail: ${replyTo}\n\n${message}`
  });

  return new Response("Message sent. Thank you!", { status: 200 });
}
