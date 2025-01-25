import Countdown from "antd/es/statistic/Countdown";
import Paragraph from "antd/es/typography/Paragraph";

const EcoCountdown = ({
  createdAt,
  expiredAt,
}: {
  createdAt: Date;
  expiredAt: number;
}) => {
  const deadline = createdAt.getTime() + expiredAt * 1000;

  return (
    <Countdown
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
      valueStyle={{ fontSize: 16 }}
      title={
        <Paragraph style={{ margin: 0, fontSize: 12 }}>Tink Access</Paragraph>
      }
      value={deadline}
    />
  );
};

export default EcoCountdown;
