import { useState, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    function handleClick() {
        sessionStorage.setItem('user', user)
        navigate('/chat')
    }

    const fileInputRef = useRef(null); // Referência para o input de arquivo
    const [imagePreview, setImagePreview] = useState(null); // Estado para pré-visualização da imagem

    const handleImgClick = () => {
        fileInputRef.current.click(); 
        sessionStorage.setItem('user', user);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result;
            setImagePreview(base64Image); 
            sessionStorage.setItem("profileImage", base64Image); 
        };
        reader.readAsDataURL(file); 
    }
    };
  return (
    <>
        <main className='h-100-vh d-flex justify-content-center align-items-center'>
            <div className='d-flex flex-column bg-2 col-sm-7 col-11 rounded p-md-4 py-4 py-md-5 px-1'>
                <div className='d-flex justify-content-center w-100'>
                    {/* <div 
                    onClick={handleImgClick} 
                    className='bg-light-color rounded-circle mb-5' style={{width: '8vw', height: '8vw', minWidth: '70px', minHeight: '70px', backgroundImage: `url(${imagePreview})`, backgroundSize: 'cover'}}>
                        
                    </div> */}
                </div>

                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <input className='col-md-8 col-10 py-2 px-3 rounded border-0 mb-4' 
                    onChange={(e) => setUser(e.target.value)}
                    type="text" placeholder='Digite um nome para se conectar'  />
                    <button onClick={handleClick} className='col-md-8 col-10 py-2 px-3 rounded border-0 text-light bg-accent-color' >Conectar ao chat</button>
                </div>


                <input type="file" id="imageInput" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileChange(e)} ref={fileInputRef} />
            </div>
        </main>
    </>
      
  )
}

export default App
