import { Routes, Route } from "react-router-dom"
import App from "./App"
import Chat from "./pages/Chat"



const MainRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<App/>} /> 
            <Route path="/chat" element={<Chat/>} />
            
        </Routes>
    )
}
export default MainRoutes