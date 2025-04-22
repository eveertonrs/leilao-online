import React from "react";
import { useParams } from "react-router-dom";

const DetalhesEvento = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalhes do Evento #{id}</h1>
      {/* Em breve: listagem dos lotes */}
    </div>
  );
};
export default DetalhesEvento;
