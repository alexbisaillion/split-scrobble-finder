import ReactGA from 'react-ga';

export const registerPageView = () => ReactGA.pageview(window.location.pathname + window.location.search);

export const registerRequest = (dataType, rulesEnabled) => {
  ReactGA.event({
    category: 'Request',
    action: dataType,
    label: rulesEnabled.toString()
  });
}

export const registerDownload = (format, dataType) => {
  ReactGA.event({
    category: 'Download',
    action: format,
    label: dataType
  });
}

export const registerCount = (count, dataType) => {
  ReactGA.event({
    category: 'Count',
    action: count.toString(),
    label: dataType
  });
}

export const registerLastfmError = (errorMsg, dataType) => {
  ReactGA.event({
    category: 'Error',
    action: errorMsg,
    label: dataType
  });
}