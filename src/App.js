import React from 'react';
import { useState,useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';
import { DownloadIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Flex, IconButton, Input, Textarea,Text, Image, useToast, Spinner } from '@chakra-ui/react';

import handleUpload from './helperFunctions/handleImgupload';
import { useNavigate } from 'react-router-dom';
import ShowLoginMessage from './components/showLoginMsg';
import DrawerExample from './components/histioryDrawer';
function App() {
 
    const [selectedImage, setSelectedImage] = useState(null);
    const [text,setText] = useState("");
    const [isLoading,setIsLoading] = useState(false)
    const [userHistory,setUserHistory] = useState([])
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const Toast = useToast()

    useEffect(()=>{
    if(user?.email){
      user?.imageDataId?.reverse()
      setUserHistory(user?.imageDataId||[])
      console.log("user.imageDataId",user.imageDataId)
    }
  },[])

  const handleImageUpload = async(event) => {
    const image = event.target.files[0];
    if(!image)return
    handleUpload(image,setSelectedImage,setText,setIsLoading,Toast,userHistory,setUserHistory)
    setSelectedImage(URL.createObjectURL(image));
    setIsLoading(true)
    const result = await Tesseract.recognize(image);
    setIsLoading(false)
    setText(result.data.text)
    console.log("Reached here",result)
    

  }
  return (
    <Box display={"flex"}   h={{lg:"100vh",xl:"100vh",base:"auto"}} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} w="100vw" >
      <Text fontSize={'2xl'} mt="20" mb="24" fontWeight={'bold'}>Img To Text Converter</Text>
      
      {user?.email&&<Box w={10}  h={10} position={"absolute"} top={5} left={4}>
        <DrawerExample setSelectedImage={setSelectedImage} setText={setText} userHistory={userHistory}/>
        </Box>}
        <Box w={{lg:"20%",xl:"20%",base:"50%"}} minW={'60'} minH={"36"} h="20%" border={"1px"} borderColor={"black"} display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Text fontSize={"lg"} fontWeight={"semibold"}>Select an Image</Text>
            <Input w="90%" h="80%" type='file' border={"none"}  accept="image/png, image/jpeg"  onChange={handleImageUpload} />
      </Box>
      {selectedImage&&
      <Box  w="100%" h={{lg:"70%",xl:"70%",base:"auto"}} display={"flex"} flexDirection={{lg:"row",xl:"row",base:"column"}} justifyContent={"space-around"} alignItems={"center"}>
      <Box minW={'60'} w="30%" my="10" h="55%" display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <Text fontSize={"lg"}  fontWeight={"semibold"}>Selected Image</Text>
        <Image w="90%" h="85%"  border="1px" src={selectedImage} alt="selectedImg.png" />
        </Box>
      <Box w="45%" minW={'60'} maxW={"400px"} minH={"400px"} my="10"h={{lg:"70%",xl:"70%",base:"auto"}} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} border={"2px"} borderColor={"black"}>
       {!isLoading?
       <>
       <Box w="full"  h="15%" display={"flex"} alignItems={"center"} justifyContent={"flex-end"} >
        <Text w="50%"  fontSize={"lg"} fontWeight={"semibold"}>Text from Image</Text>
        <DownloadIcon onClick={()=>{
           handleDownload(text)
        }}
         boxSize={6} />

        </Box>
       <Textarea borderRight={"none"} borderLeft={"none"} w="full" minH="355px" value={text==="null"?"Seems like the image you selected has no text in it":text}
></Textarea>
</>:
      <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />}
      </Box>
      </Box>
      }
<ShowLoginMessage navigate={navigate}/>
    </Box>
  )
   
}





function handleDownload(text){
  const blob = new Blob([text], { type: 'text/plain' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "imgToText";

  a.click();

  // Clean up by revoking the URL object to free up resources
  URL.revokeObjectURL(url);
}

export default App;
