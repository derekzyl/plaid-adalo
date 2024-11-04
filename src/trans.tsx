import react, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TransHapp() {
  const { token } = useParams();
  //   console.log(token);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      if (data[0]) return;
      let datas: any = await fetch(
        "https://plaid-external-api.herokuapp.com/api/transactions/" + token
      );
      datas = await datas.json();
      console.log({ datas });
      setData(datas.latest_transactions || []);
      setLoading(false);
    })();
  });
  //   console.log(data);
  return (
    <>
      <div className="head">
        <h2> latest Transactions</h2>
      </div>
      <div className="tsx-cont">
        {loading && <h1>Loading ...</h1>}
        {!loading && !data[0] && <h3>no transactions yet</h3>}
        {data[0] &&
          data
            .slice(0)
            .reverse()
            .map((data, i) => (
              <div className="tsx" key={i}>
                <div className="tsx-top">
                  <h5>{data.authorized_date}</h5>
                  <h3>{data.merchant_name ?? "unknown"}</h3>
                  <h4>for {data.category[0]}</h4>
                </div>
                <div className="cur">
                  <h3 style={{ marginLeft: "8px" }}>
                    {" "}
                    {data.amount < 0 ? (
                      <h4 style={{ color: "red" }}>
                        {data.iso_currency_code} {data.amount}
                      </h4>
                    ) : (
                      <h4 style={{ color: "green" }}>
                        {data.iso_currency_code} {data.amount}
                      </h4>
                    )}
                  </h3>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}

export default TransHapp;
