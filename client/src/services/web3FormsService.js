const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "";
const ADMIN_EMAIL = "growstackagency@gmail.com";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const formatDH = (amount) =>
  `${new Intl.NumberFormat("fr-FR").format(Math.round(Number(amount) || 0))} DH`;

/**
 * Submits the order to Web3Forms, which emails the payload to
 * growstackagency@gmail.com. Returns { success, result?, error?, message? }.
 * Logs the payload before dispatch and every failure via console.error
 * so issues are visible in the browser Developer Tools.
 */
export async function sendOrderViaWeb3Forms(orderData) {
  console.log("Submitting payload:", orderData);

  if (!ACCESS_KEY) {
    const error = new Error(
      "Web3Forms access key is missing. Set VITE_WEB3FORMS_ACCESS_KEY in the client .env file, then restart `npm run dev`."
    );
    console.error("Web3Forms configuration error:", error.message);
    return {
      success: false,
      error,
      message: "Clé d'accès Web3Forms manquante (VITE_WEB3FORMS_ACCESS_KEY)",
    };
  }

  const items = orderData.items || [];
  const selectedServices =
    items.length > 0
      ? items
          .map((item) => `${item.title || "Service"} (${formatDH(item.price)} DH)`)
          .join("\n")
      : (orderData.serviceNames || []).join(", ") || "Aucun service";

  const links = [];
  if (orderData.website) links.push(orderData.website);
  (orderData.references || []).forEach((r) => {
    if (r && r.url && String(r.url).trim()) links.push(r.url);
  });
  const referenceLinks = links.join(", ") || "Aucun lien";

  const total = Number(orderData.total ?? orderData.price) || 0;
  const subtotal = Number(orderData.subtotal) || 0;
  const discount = Number(orderData.discount) || 0;

  const payload = {
    access_key: ACCESS_KEY,
    subject: `🚀 Nouveau Projet Growstack - ${orderData.clientName || "Client"}`,
    from_name: "Growstack Website",
    to_email: ADMIN_EMAIL,
    client_name: orderData.clientName || "",
    client_email: orderData.email || "",
    client_phone: orderData.phone || "",
    company_name: orderData.companyName || "",
    industry: orderData.industry || "",
    order_id: orderData.orderId || "",
    selected_services: selectedServices,
    subtotal: `${formatDH(subtotal)}`,
    discount: discount > 0 ? `${formatDH(discount)}` : "",
    promo_code: orderData.promoCode || "",
    total_price: `${formatDH(total)}`,
    project_details: orderData.description || "Aucune description",
    timeline: orderData.timeline || "",
    budget: orderData.budget
      ? `${new Intl.NumberFormat("fr-FR").format(Number(orderData.budget) || 0)} DH`
      : "",
    reference_links: referenceLinks,
    files:
      (orderData.files || [])
        .map((f) => f.url ? f.name || f.filename || f.url : "")
        .filter(Boolean)
        .join(", ") || "Aucun fichier",
  };

  console.log("Web3Forms payload:", payload);

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Web3Forms response:", result);

    if (result.success) {
      return { success: true, result };
    }

    console.error("Web3Forms error response:", result);
    return {
      success: false,
      result,
      message: result.message || "Vérifiez la clé d'accès",
    };
  } catch (error) {
    console.error("Network error:", error);
    return { success: false, error, message: error.message };
  }
}

export function isWeb3FormsConfigured() {
  return Boolean(ACCESS_KEY);
}