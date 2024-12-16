import { useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Stomp } from "@stomp/stompjs";

import React, { useEffect, useState } from 'react';


function Chat(){

    const user = sessionStorage.getItem('user')
    // const image = sessionStorage.getItem('profileImage').toString()

    const [isConnected, setIsConnected] = useState(false)


    const [messages, setMessages] = useState([]); // Lista de mensagens recebidas
    const [messageConnect, setMessageConnect] = useState([]); 
    const [connectedUsers, setConnectedUsers] = useState([null]);

    const [showAlert, setShowAlert] = useState(false);

    const [inputMessage, setInputMessage] = useState(""); // Mensagem a ser enviada
    const stompClientRef = useRef(null); // Referência para o cliente Stomp
    const messagesEndRef = useRef(null); // Referência para o final da lista de mensagens
    useEffect(() => {
        // Garante que a área de mensagens seja rolada para o final
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    

    
    const colors = ['#FF5714', '#1B998B', '#98CE00', '#315659', '#7F7EFF']
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex]
    }

    const [userColors, setUserColors] = useState([{}])


    function whenConnected(parsedMessage) {
        if(parsedMessage.type === 'simple-message'){
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);

        } else if (parsedMessage.type === 'connect' || parsedMessage.type === 'disconnect'){

            setMessageConnect((prevMessages) => [...prevMessages, parsedMessage]);
            showPopup(parsedMessage.message, parsedMessage)

            if(parsedMessage.type === 'connect' && parsedMessage.user === user) {
                setIsConnected(true)  
            }

            parsedMessage.type === 'disconnect' && parsedMessage.user === user &&
            setIsConnected(false)

            
        }
        if(parsedMessage.type === 'users-connected-list') {
            setConnectedUsers(parsedMessage.usersConnected)
        } 
        if(parsedMessage.type === 'user-colors') {
            setUserColors(parsedMessage.userColors)
        } 
        
    }

    console.log('Usuários conectados: ', connectedUsers)
    

    function showPopup(message, parsedMessage) {
        setShowAlert(message)


        // Remove o popup após 3 segundos
        setTimeout(() => {
            setShowAlert(false)
            
            removeMessage(parsedMessage);
        }, 3000);
    }
    function removeMessage(parsedMessage) {
        setMessageConnect((prevMessages) =>
            prevMessages.filter((message) => message !== parsedMessage)
        );
    }
    
    useEffect(() => {
        const connectWebSocket = () => {
            // Conexão ao servidor WebSocket
                const stompClient = Stomp.client("ws://livechat.andradedev.com.br:8080/buildrun-livechat-websocket");


            stompClient.connect({}, 
                () => {
                    console.log('conectando...')
                    

                    stompClient.subscribe("/topics/live-chat", (message) => {
                        const parsedMessage = JSON.parse(message.body);

                        console.log("Mensagem recebida:", parsedMessage); 

                        whenConnected(parsedMessage)
                        
                    });

                    stompClient.send(
                        "/app/register", 
                        {},
                        JSON.stringify({ 
                            "user": user, 
                            "type": 'connect',
                            "message": null
                        })
                    );

                    stompClient.send(
                        "/app/listOfUsers", 
                        {},
                        JSON.stringify({ "user": sessionStorage.getItem("user"),
                            "type": "connected-user" })
                    );

                    stompClient.send(
                        "/app/user-colors", 
                        {},
                        JSON.stringify({ 
                            "user": user, 
                            "color": getRandomColor(),
                            "type": 'connected-user'
                        })
                    );
                },
                
            );

            stompClientRef.current = stompClient; // Armazena a instância do cliente para uso posterior
        };
        
        connectWebSocket();

        return () => {
            // Desconexão quando o componente é desmontado
            if (stompClientRef.current) {

                stompClientRef.current.send(
                    "/app/listOfUsers", 
                    {},
                    JSON.stringify({ "user": sessionStorage.getItem("user"),
                        "type": "disconnected-user" })
                );

                // Encontrar objeto no userColors que contenha o usuário e a
                const userColorFind = userColors.find((entry) => entry.user === user)
                stompClientRef.current.send(
                    "/app/user-colors", 
                    {},
                    JSON.stringify({ 
                        "user": userColorFind.user, 
                        "color": userColorFind.color,
                        "type": 'disconnected-user'
                    })
                );

                stompClientRef.current.send("/app/exit",
                    {},
                    JSON.stringify({ 
                        "user": user, 
                        "type": 'disconnect',
                        "message": null
                    })
                )

            
                stompClientRef.current.disconnect(() => {
                    console.log("Desconectado do WebSocket.");
                });
            }
        };
    }, []);

    console.log(userColors)
    
    const sendMessage = () => {
        if (stompClientRef.current && inputMessage.trim()) {
            stompClientRef.current.send(
                "/app/new-message", 
                {},
                JSON.stringify({ user: user,
                    message: inputMessage })
            );
            setInputMessage(""); // Limpa o campo de entrada
        }
    };

    

    const navigate = useNavigate()

    const textareaRef = useRef(null);

    // Função para ajustar a altura do textarea
    const handleInput = () => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Redefine a altura para recalcular
        textarea.style.height = `${Math.min(textarea.scrollHeight, 5 * 24)}px`; // Limita o crescimento a 5 linhas (ajuste conforme necessário)
    };

    console.log(userColors.find((entry) => entry.user === user))


    const boxMessageOfUser = () => {
        return(
            messages && messages.map(message => 
                message.user === user ? (
                    <div className="w-100 d-flex flex-row-reverse justify-content-start align-items-end mt-4">
                    <div className='bg-2 rounded-circle border-escura ms-3' style={{width: '3vh', height: '3vh', minWidth: '15px', minHeight: '15px'}}></div>

                        <div className="bg-2 p-3 rounded" style={{minWidth: '200px', maxWidth: '70%'}}>
                            <p className="text-wrap text-break m-0 w-100">{message.message}</p>
                        </div>
                </div>
                ) : (
                    <div className="w-100 d-flex  justify-content-start align-items-end mt-4">
                        <div className='d-flex justify-content-center align-items-ceter bg-2 rounded-circle border-escura me-3' 
                        style={{width: '5vh', 
                        height: '5vh', 
                        minWidth: '30px', 
                        minHeight: '30px', 
                        fontWeight: 'bold',
                        backgroundColor: `${userColors.find((entry) => entry.user === message.user)?.color || '#7F7EFF'
                        }`}}>
                            <p className="m-0 d-flex justidy-content-center align-items-center">{message.user.charAt(0).toUpperCase()}</p>
                        </div>

                        <div className="bg-2 p-3 rounded" style={{minWidth: '50px', maxWidth: '70%'}}>{message.message}</div>
                   </div>
                )
            )
        )
    }

    const handleSendMessage = () => {
        setInputMessage('')
        navigate('/')
    }

    function usersOnGenerate(){
        return connectedUsers.slice(0, 3).map((user, index) => (
            user !== sessionStorage.getItem('user') && (
                <div
                key={user} // Certifique-se de que "user" seja único
                className="rounded-circle bg-2 border-escura d-flex justify-content-center align-items-center fw-bold"
                style={{
                    width: '30px',
                    height: '30px',
                    position: index === 0 ? 'static' : 'absolute', // Apenas a primeira não terá "absolute"
                    right: index === 0 ? 'auto' : `${10 * index}px`,
                    backgroundColor: userColors.find((entry) => entry.user === user)?.color  // Ajusta a posição para as demais
                }}
            > <p className="m-0">{user !== null && user.charAt(0).toUpperCase()}</p> </div>
            )
        ));
    }
    

    return(
        <>
            <div className="d-flex flex-column h-100-vh">
                <header className="d-flex justify-content-between fixed-top bg-light-color p-4">
                    <div className="w-50 d-flex align-items-center">
                        <IoMdArrowRoundBack
                        onClick={() => handleSendMessage()} 
                        style={{width: '5vh', height: '5vh', minWidth: '25px', minHeight: '25px'}} />
                        <h1 className="fs-5 text-nowrap mb-0 ms-4">Chat Group</h1>
                    </div>

                    {/* <div className="w-50 d-flex justify-content-end align-items-center ">

                        <div className="rounded-circle me-2 mt-1" style={{width: '12px', height: '12px', backgroundColor: 'green'}} ></div>
                        <p className="m-0 fs-5 fw-bold text-center"> connected: {user} </p>
                        
                    </div> */}

                    <div className="w-50 d-flex justify-content-end align-items-center position-relative">

                        {/* <div className="rounded-circle pt-3 bg-2 border-escura" style={{width: '25px', height: '25px'}}></div>
                        <div className="rounded-circle pt-3 bg-2 border-escura" style={{width: '25px', height: '25px', position: 'absolute', right: '10px'}}></div>
                        <div className="rounded-circle pt-3 bg-2 border-escura" style={{width: '25px', height: '25px', position: 'absolute', right: '20px'}}></div> */}
                        {usersOnGenerate()}

                    </div>


                </header>

                <main className="content flex-grow-1 overflow-auto px-4 d-flex justify-content-end flex-column position-relative" style={{paddingBottom: '170px', paddingTop: '90px '}}>

                    {showAlert &&  <div style={{position:'absolute', top: 100, left:'45%'}} className="px-3 py-2 bg-2 rounded-5 text-center" >
                        <p style={{fontSize: '.8rem'}} className="m-0">{showAlert}</p>
                        </div>}


                   {boxMessageOfUser()}
                   <div ref={messagesEndRef} />
                </main>

                <footer className="d-flex justify-content-center fixed-bottom text-white p-3 bg-white" >
                    <div className="w-100 d-flex flex-column bg-2 rounded-3 p-3">
                        <textarea 
                        className="bg-light message-input rounded border-0 mb-3 d-flex align-items-center justify-content-center py-2 px-3" 
                        ref={textareaRef}
                        onInput={handleInput}
                        onChange={(e) => setInputMessage(e.target.value)}
                        value={inputMessage}
                        rows="1"/>
                        <div className="d-flex justify-content-between">
                            <div className="bg-light rounded text-dark d-flex align-items-center justify-content-center" style={{width: '3vw', height: '3vw', minWidth: '30px', minHeight: '30px'}}>
                                <IoMdAdd/>
                            </div>
                            

                            <div className="w-50 d-flex align-items-center justify-content-end">
                                <button onClick={() => sendMessage()} className="border-0 p-1 col-sm-4 col-8 rounded bg-blackk text-light">
                                Enviar
                            </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Chat