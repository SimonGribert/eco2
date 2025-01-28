import Link from "antd/es/typography/Link";

const Home = () => {
  return (
    <div>
      <Link
        href={`https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.TINK_CLIENT_ID}&redirect_uri=${process.env.TINK_REDIRECT_URL}&market=SE&locale=en_US`}
        target="_self"
      >
        Request Tink Access
      </Link>
    </div>
  );
};

export default Home;
