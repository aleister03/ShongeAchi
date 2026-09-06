import "@/app/styles/payments.css";

// Loads the payment sandbox's fonts (Manrope, Material Symbols) and
// custom CSS classes, scoped only to this route tree so the rest of the
// app's typography/styling is unaffected.
export default function CheckoutLayout({ children }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <div className="font-manrope" style={{ background: "#fdfae9", minHeight: "100vh" }}>
        {children}
      </div>
    </>
  );
}
