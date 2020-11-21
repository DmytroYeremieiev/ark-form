import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import 'styles/reset.scss';
import 'styles/Global.scss';

interface LayoutProps {
  children: JSX.Element[];
}

class Layout extends React.Component<LayoutProps, unknown> {
  render() {
    const { children } = this.props;
    return <div className='all-content'>{children}</div>;
  }
}

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <Head>
          <title>React POC project</title>
          <meta name='robots' content='noindex,nofollow'></meta>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        {/* <Header></Header> */}
        <Component {...pageProps} />
      </Layout>
    );
  }
}
