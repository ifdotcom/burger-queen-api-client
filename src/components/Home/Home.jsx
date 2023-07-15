import { useState } from "react";
import "./Home.css";
import Banner from "../Banner/Banner";
import "../Banner/Banner.css";
import Title from "../Title/Title";
import "../Title/Title.css";
import Input from "../Input/Input";
import "../Input/Input.css";
import Button from "../Button/Button";
import "../Button/Button.css";
import Footer from "../Footer/Footer";
import "../Footer/Footer.css";
import { useNavigate } from "react-router-dom";
import { getLogin } from "../../lib/api";
import { logo } from "../../images";

function Home() {
  const navigate = useNavigate();

  const [valueEmail, setEmail] = useState("");
  const [valuePwd, setPwd] = useState("");
  const [fail, setFail] = useState("");

  const login = () => {
    getLogin(valueEmail, valuePwd)
      .then((res) => {
        if (res.user.role === "admin") {
          // console.log(res);
          navigate("/admin");
        } else if (res.user.role == "waiter") {
          navigate("/waiter");
        } else if (res.user.role === "chef") {
          navigate("/chef");
        }

        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("user", res.user.email);
      })
      .catch((err) => {
        //console.log(err);
        new Error(
          setFail(
            "¡Ups! Ha ocurrido un error. Por favor verifica tu credenciales"
          )
        );
      });
  };

  function handleSubmit(e) {
    // Previene que el navegador recargue la página
    e.preventDefault();
    // Lee los datos del formulario
    login();
  }

  return (
    <>
      <Banner />
      <div>
        <img src={logo} className='logo' alt='Logo Burguer Queen' />
      </div>
      <Title title='Iniciar Sesión' />
      <div className='formLogin'>
        <form method='post' onSubmit={handleSubmit} className='formLogin'>
          <Input
            textLabel='Correo Electrónico'
            type='email'
            className='input'
            id='email'
            placeholder='ejemplo@ejemplo.com'
            value={valueEmail}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            textLabel='Contraseña'
            type='password'
            className='input'
            autoComplete='current-password'
            id='password'
            name='myInput'
            placeholder='******'
            value={valuePwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          {fail && <span className='failLogin'>{fail}</span>}

          <Button
            id='btnLogin'
            className='btnLogin'
            type='submit'
            text='Iniciar Sesión'
          />
        </form>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Home;
