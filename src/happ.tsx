import React from "react";
import react, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useParams } from "react-router-dom";
function Happ() {
  const linkedIn = "https://plaid-external-api.herokuapp.com";
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const { email } = useParams();
  console.log(email, "the email don show");

  useEffect(() => {
    const generateToken = async () => {
      const userEmail: Record<string, any> = {
        email: email,
        name: "name",
      };
      console.log(process.env.TOKEN, " this na the user token");

      // console.log(userEmail, email, " omoh na the user emailbe this o");
      const linker = linkedIn + "/api/create_link_token";
      const response = await fetch(linker, {
        method: "POST",

        headers: {
          "Access-Control-Allow-Origin": "*",
          cors: "no cors",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userEmail),
      });
      const data = await response.json();
      console.log(data);
      setLinkToken(data.link_token);

      // localStorage.setItem("link_token", data.link_token);
    };
    generateToken();
  }, [email]);

  const onSuccess = React.useCallback(
    (public_token: any, metadata: any) => {
      // send public_token to server
      const setToken = async () => {
        interface dataMeI {
          public_token: any;
          metadata: any;
          url: string;
        }
        const dataMe: dataMeI = {
          public_token: public_token,
          metadata: metadata,
          url: "hello world",
        };

        console.log(dataMe, "this na data me ooooo");
        const theLinkToSetApiToken = linkedIn + "/api/set_access_token";

        const response = await fetch(theLinkToSetApiToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: JSON.stringify(dataMe),
        });
        const data = await response.json();

        // console.log(data, "this is data ");
        // access, name, email,

        const assetTokenUrl =
          "https://api.adalo.com/v0/apps/69b55ee9-c146-4b1f-aaf4-9b9a6744c12b/collections/t_1636ci0vwwbl5umyx10i189g6";

        // "https://api.adalo.com/v0/apps/f5c39e08-045a-4a03-95a0-1b333915bf26/collections/t_ey36weo3waqb805kl2d0w54k7";
        const getAllAssetToken = await fetch(
          assetTokenUrl,

          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer 50wpdudj9r7sl13mym98a2ica",
            },
          }
        );

        const gottenAllAssetsToken = await getAllAssetToken.json();

        interface postingAssetTokenDataI {
          name: string;
          token: string;
          User: any;
          item_id: string;
          institution_id: string;
        }

        let postingAssetTokenData: postingAssetTokenDataI = {
          name: "",
          token: "",
          User: "",
          item_id: "",
          institution_id: "",
        };
        let bankName = "";
        let theLoggedUser = "";

        if (gottenAllAssetsToken.records.length === 0) {
          postingAssetTokenData = {
            name: dataMe.metadata.institution.name,
            token: data.access_token,
            User: email,
            item_id: data.item_id,
            institution_id: dataMe.metadata.institution.institution_id,
          };
          if (
            postingAssetTokenData.name !== null &&
            postingAssetTokenData.User !== null &&
            postingAssetTokenData.name !== undefined &&
            postingAssetTokenData.User !== undefined
          ) {
            const postAssetToken = await fetch(
              assetTokenUrl,

              {
                method: "POST",
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  Authorization: "Bearer 50wpdudj9r7sl13mym98a2ica",
                },
                body: JSON.stringify(postingAssetTokenData),
              }
            );
            const postedAssetData = await postAssetToken.json();
            console.log(postedAssetData);
            console.log(
              "<<<_____________from adalo____________________--------",
              gottenAllAssetsToken.records.length,
              "<<<<------------------from adalo------------------------>>"
            );
          } else {
            throw new Error(" user data is null");
          }
        } else {
          for (let c of gottenAllAssetsToken.records) {
            try {
              if (c.User !== null && c.User !== undefined) {
                const fetchUser = await fetch(
                  "https://api.adalo.com/v0/apps/69b55ee9-c146-4b1f-aaf4-9b9a6744c12b/collections/t_df7a5dc882ff468a80bbf09a52a16e0e/" +
                    c.User,
                  // "https://api.adalo.com/v0/apps/f5c39e08-045a-4a03-95a0-1b333915bf26/collections/t_dc2b4735dd424c5c963a8360b2bfbdb8/"

                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer 50wpdudj9r7sl13mym98a2ica",
                    },
                  }
                );

                const userFetched = await fetchUser.json();
                console.log(userFetched);

                if (
                  c.name === dataMe.metadata.institution.name &&
                  userFetched.Email === email
                ) {
                  bankName = c.name;
                  theLoggedUser = userFetched.Email;
                  console.log(
                    "data_gotten",
                    c.name,
                    dataMe.metadata.institution.name && userFetched.Email,
                    email
                  );
                  throw new Error(
                    dataMe.metadata.institution.name +
                      "  bank account is already registered by  " +
                      userFetched.Email
                  );
                } else {
                  postingAssetTokenData = {
                    name: dataMe.metadata.institution.name,
                    token: data.access_token,
                    User: email,
                    item_id: data.item_id,
                    institution_id: dataMe.metadata.institution.institution_id,
                  };
                }
              } else {
                console.log(c.User);
              }
            } catch (e) {
              console.log(e);
            }
          }

          if (
            postingAssetTokenData.name !== null &&
            postingAssetTokenData.User !== null &&
            postingAssetTokenData.name !== undefined &&
            postingAssetTokenData.User !== undefined &&
            postingAssetTokenData.User !== theLoggedUser &&
            postingAssetTokenData.name !== bankName
          ) {
            console.log(
              "<<----------------------- \n",
              postingAssetTokenData,
              "------------------------------->>"
            );

            const postAssetToken = await fetch(
              assetTokenUrl,

              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer 50wpdudj9r7sl13mym98a2ica",
                },
                body: JSON.stringify(
                  JSON.parse(JSON.stringify(postingAssetTokenData))
                ),
              }
            );
            const postedAssetData = await postAssetToken.json();
            console.log(postedAssetData);
            console.log(
              "<<<_____________from adalo____________________",

              "<<<<------------------from adalo------------------------>>"
            );
          } else {
            console.log("the user has already added this account");
          }
        }
      };
      setToken();
      // Handle response ...
    },
    [email]
  );
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <button className="theButton" onClick={() => open()} disabled={!ready}>
      Link Account
    </button>
  );
}
export default Happ;
