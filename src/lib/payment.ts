const PAYMENT_CONFIG = {
  methods: (process.env.PAYMENT_METHODS || "qr") as "qr" | "stripe" | "both",
  pichincha: {
    qrImage: process.env.PICHINCHA_QR_IMAGE || "/qr-deuna.png",
    accountName: process.env.PICHINCHA_ACCOUNT_NAME || "Tziwu Intercambios Culturales",
    accountId: process.env.PICHINCHA_ACCOUNT_ID || "",
    phone: process.env.PICHINCHA_PHONE || "",
    amount: parseInt(process.env.PICHINCHA_AMOUNT || "0", 10),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    price: parseInt(process.env.STRIPE_PRICE || "0", 10),
    currency: process.env.STRIPE_CURRENCY || "usd",
  },
} as const;

export function getPaymentConfig() {
  return PAYMENT_CONFIG;
}

export function getPublicPaymentConfig() {
  return {
    methods: PAYMENT_CONFIG.methods,
    pichincha: {
      accountName: PAYMENT_CONFIG.pichincha.accountName,
      amount: PAYMENT_CONFIG.pichincha.amount,
    },
    stripe: {
      publishableKey: PAYMENT_CONFIG.stripe.publishableKey,
      price: PAYMENT_CONFIG.stripe.price,
      currency: PAYMENT_CONFIG.stripe.currency,
    },
    isPaymentRequired:
      PAYMENT_CONFIG.pichincha.amount > 0 || PAYMENT_CONFIG.stripe.price > 0,
  };
}
