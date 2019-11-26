// @ts-nocheck
export function setupGoogleAnalytics()
{
    return;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
}

export function sendPageView(path)
{
    return;
    gtag('config', 'GA_MEASUREMENT_ID', {'page_path': path});
}