const orderConfirmationPush = (order) => ({
  title: "✅ Order Confirmed",
  body: `Your order #${order._id.toString().slice(-6)} for ${(order.total || 0).toLocaleString("fr-FR")} MAD is confirmed.`,
  data: {
    trigger: "order_confirmed",
    orderId: order._id.toString(),
    total: order.total,
  },
});

module.exports = orderConfirmationPush;
