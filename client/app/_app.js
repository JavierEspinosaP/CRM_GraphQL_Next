
export default function MyApp({ Component, pageProps }) {
  console.log("desde myapp");
  return (
      <Component {...pageProps} />

  );
}
