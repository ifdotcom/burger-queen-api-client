import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cutEmail, getOrders, updateOrder } from "../../lib/api";
import Banner from "../Banner/Banner";
import Header from "../Header/Header";
import { TfiTimer } from "react-icons/tfi";
import { AiOutlineUser } from "react-icons/ai";
import "../Chef/Chef.css";
import Button from "../Button/Button";

function Chef() {
  const navigate = useNavigate();
  const [dataOrders, setDataOrders] = useState([]);
  const token = localStorage.getItem("token");
  const authorization = `Bearer ${token}`;
  const user = localStorage.getItem("user");
  const userInLine = cutEmail(user);
  localStorage.setItem("userInLine", userInLine);
  const [getOrdersStatus, setGetOrdersStatus] = useState("loading");

  useEffect(() => {
    getOrders(authorization)
      .then((res) => {
        console.log(res);
        const listWithStatusDelivered = [...res].filter(
          (e) => e.status === "delivered"
        );
        setDataOrders(listWithStatusDelivered);
        setGetOrdersStatus("success");
      })
      .catch((error) => {
        error;
        setGetOrdersStatus("error");
      });
  }, [authorization]);

  function getTime(dateEntry, dateProcessed) {
    const inicio = new Date(dateEntry);
    const fin = new Date(dateProcessed);
    console.log(dateEntry, dateProcessed);
    let diff = fin - inicio;
    let h, m, s;
    h = Math.floor(diff / 1000 / 60 / 60);
    m = Math.floor((diff / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((diff / 1000 / 60 / 60 - h) * 60 - m) * 60);
    s < 10 ? (s = `0${s}`) : (s = `${s}`);
    m < 10 ? (m = `0${m}`) : (m = `${m}`);
    h < 10 ? (h = `0${h}`) : (h = `${h}`);

    return <span>{"Pasaron: " + h + ":" + m + ":" + s}</span>;
  }

  function goTakeOrder() {
    navigate("/waiter");
  }

  function deleteOrderId(id, status) {
    status = "deleted";
    updateOrder(authorization, id, status).then((res) => {
      res;
    });
    alert("Entregado con éxito");
    let newList = [...dataOrders];
    newList = newList.filter((i) => i.id !== id);
    setDataOrders(newList);
  }

  // Otra manera de renderizar las ordenes
  //   const [filteredOrders, setFilteredOrders] = useState([]);

  // //dentro de useEffect:
  // const filtered = res.filter((order) => order.status !== "delivered");
  //       setFilteredOrders(filtered);

  // function confirmUpdate(id, status) {
  //     status = "delivered";
  //     updateOrder(authorization, id, status).then((res) => {
  //       const updatedOrders = filteredOrders.filter((order) => order.id !== id);
  //       setFilteredOrders(updatedOrders);
  //       return res;
  //     });
  //   }

  // //para renderizar:

  // filteredOrders.map((order) => {

  return (
    <>
      <Banner />
      <Header user={userInLine} text='Mesera/o' />
      <div className='containerButtons'>
        <Button text='Tomar pedido' onClick={goTakeOrder} />
      </div>
      {getOrdersStatus === "loading" ? (
        <p data-testid='loadingOrders'>Cargando...</p>
      ) : getOrdersStatus === "success" && dataOrders.length === 0 ? (
        <p data-testid='successWithNothing' className='viewOrders'>
          Aún no hay pedidos
        </p>
      ) : getOrdersStatus === "success" ? (
        <div className='containerTableOrder' data-testid='tableOrders'>
          <div className='columns'>
            <span className='id'>Orden</span>
            <span className='email'>Detalle</span>
          </div>
          {dataOrders.map((order) => {
            const childrenOfOrder = order.products.map((e) => {
              return (
                <ul key={order.id + "-" + e.product.id}>
                  <li>{e.qty}</li>
                  <img
                    src={e.product.image}
                    alt='img product'
                    style={{ width: "70px", height: "70px" }}
                  />
                  <li>{e.product.name}</li>
                </ul>
              );
            });
            return (
              <div key={order.id} className='containerOrders'>
                <div className='dataClient'>
                  <ul>
                    <div className='client'>
                      <AiOutlineUser size={25} />
                      <li>{order.client}</li>
                    </div>
                    <div className='timer'>
                      <TfiTimer size={25} />
                      {getTime(order.dateEntry, order.dateProcessed)}
                    </div>
                  </ul>
                </div>
                <div className='dataOrder'>
                  {childrenOfOrder}
                  <Button
                    id='btnUpdate'
                    text='Entregado'
                    onClick={() => deleteOrderId(order.id, order.status)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : getOrdersStatus === "error" ? (
        <p data-testid='ordersError' className='viewChef'>
          Ha ocurrido un error
        </p>
      ) : null}
    </>
  );
}

export default Chef;
