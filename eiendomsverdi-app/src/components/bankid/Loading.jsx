import "./loading.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Loading = (props) => {
  const navigate = useNavigate();
  const fødselsnummer = props.pNr;

  const messages = {
    apiError:
      "Ser ut til at det dessverre er en feil hos leverandøren av tjenesten. \
      Legg gjerne igjen kontaktinformasjon så skal vi gi en lyd når alt er oppe og går igjen 😉",
    noInfoError:
      "Ser ut til at vi dessverre ikke finner noen eiendommer på ditt navn. \
      Grunnen til dette kan være en feil hos leverandøren av tjenesten eller \
      at du ikke eier noen boliger. Legg gjerne igjen kontaktinformasjon \
      så skal vi gi en lyd når dette er fikset 😉",
  };

  let [apiValues, setApiValues] = useState({
    firstname: "",
    apiInfo: [],
    // houseValue: "",
  });

  let [loading, setLoading] = useState(true);

  // sender fødselsnummer fra input til backend
  useEffect(() => {
    const controller = new AbortController();
    axios
      .post("http://localhost:3001/api", {
        signal: controller.signal,
        pNr: fødselsnummer,
      })
      .then((response) => {
        setApiValues({
          firstname: response.data.firstname.name,
          apiInfo: response.data.apiInfo,
          // houseValue: response.data.data.address.municipality,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (err.response || err.request) {
          console.log("Error", err.message);
          navigate("/stopPage", { state: { error: messages.apiError } });
          // res = The client was given an error response (5xx, 4xx)
          // req = The client never received a response, and the request was never left
        } else {
          console.log("Error", err.message);
          navigate("/stopPage", { state: { error: messages.noInfoError } });
          // Anything else
        }
      });
    return () => {
      controller.abort();
    };
  }, []);

  if (!loading) {
    navigate("/boligverdi", {
      state: { pNr: fødselsnummer, apiValues: apiValues },
    });
  }

  return (
    <div className="Loading">
      <div className="loadingAnimation">
        <span></span>
        <span></span>
        <span></span>
        <h2 style={{ marginTop: "100px" }}>Henter data</h2>
      </div>
    </div>
  );
};
