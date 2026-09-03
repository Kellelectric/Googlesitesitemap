import Script from 'next/script'

// Renders nothing unless NEXT_PUBLIC_ZOHOSALESIQ_WIDGET_CODE is set in the
// deployment environment - no widget code is hardcoded or invented here. Set
// it once the Zobot is built and the widget is embedded from the Zoho
// SalesIQ dashboard (Settings -> Installation -> copy the "wc=" value from
// the generated embed snippet) - see docs/zoho-salesiq-zobot.md for the full
// bot design and setup walkthrough. Replaces the earlier Botpress trial
// embed - only one chat widget should ever be loaded at a time.
//
// strategy="lazyOnload" defers fetching and running this third-party widget
// bundle until the browser is idle after the rest of the page has loaded -
// matches the same reasoning that applied to the Botpress embed it replaces
// (a chat widget isn't needed for the initial render or first interaction,
// and loading it any earlier measurably hurt mobile PageSpeed Performance).
export function ZohoSalesIQ() {
  const widgetCode = process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGET_CODE
  if (!widgetCode) return null

  return (
    <>
      <Script id="zsiq-init" strategy="lazyOnload">
        {`
          var $zoho = $zoho || {};
          $zoho.salesiq = $zoho.salesiq || { ready: function () {} };
        `}
      </Script>
      <Script
        id="zsiqscript"
        src={`https://salesiq.zohopublic.com/widget?wc=${widgetCode}`}
        strategy="lazyOnload"
      />
    </>
  )
}
