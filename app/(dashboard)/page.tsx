import Link from "antd/es/typography/Link";

const Home = () => {
  return (
    <div>
      <Link
        href={`https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.TINK_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Ftink-callback&market=SE&locale=en_US`}
        target="_self"
      >
        Request Tink Access
      </Link>
    </div>
  );
};

export default Home;
