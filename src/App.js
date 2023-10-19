import React from 'react';
import { useState,useEffect } from 'react';
import './App.css';
import { DownloadIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Flex, IconButton, Input, Textarea,Text, Image, useToast, Spinner } from '@chakra-ui/react';

import { returnImageDataUrl, saveImageUrl } from './url';
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
    // const result = await Tesseract.recognize(image);
    // setIsLoading(false)
    // setText(result.data.text)
    // console.log("Reached here",result)
    

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


const handleUpload = async (selectedImage,setSelectedImage,setText,setIsLoading,Toast,userHistory,setUserHistory) => {
 let user = JSON.parse(localStorage.getItem('user'))
  if (selectedImage) {
    const formData = new FormData();
    formData.append('image', selectedImage);
    const headers = new Headers();
if(!user){
  document.getElementById('userExist').click()
}
// Add headers as key-value pairs to the Headers object
  if(user?.token)headers.append('Authorization',`Bearer ${user.token}`);
 console.log("user",user?.email)
    
    try {
      let url = !user?.email? returnImageDataUrl:saveImageUrl
      const response = await fetch(url, {
        method: 'POST',
        // contentType: 'application/json,
        body: formData,
        // responseType: 'blob'
         headers:headers,
        mode:"cors"
        
        
      });
console.log("response",response)
const responseJson = await response.json()

      if (response.status==201||response.status==200) {
        const bufferData = responseJson.message.orignalImage.data;

        // Convert the data to an ArrayBuffer
        const arrayBuffer = new ArrayBuffer(bufferData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bufferData.length; i++) {
          view[i] = bufferData[i];
        }
        const blob = new Blob([arrayBuffer]);
        const url = URL.createObjectURL(blob)
        setSelectedImage(url)
        setText(responseJson.message.textData)
        setIsLoading(false)
        let obj ={
          _id:responseJson.message._id,
          fileName:responseJson.message.filename
        }
        console.log("obj---",obj)
        setUserHistory([obj,...userHistory])
       if(user?.email) Toast(  {
          title: 'Successfully added',
          status: 'success',
          duration: 4000,
          isClosable: true,
        })

      } else if(response.status!==500){
        console.error('Image upload failed.');
        setIsLoading(false);
        return Toast({
          title: responseJson.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
      else{
        setIsLoading(false);

        return Toast({
          title: "Internal server error refresh and retry",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    } catch (error) {
      setIsLoading(false);

      console.error('Error while uploading the image:', error);
      return Toast({
        title: "Internal server error refresh and retry",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }
};


function handleDownload(text){
  const blob = new Blob([text], { type: 'text/plain' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an <a> element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = "imgToText";

  // Trigger a click event on the <a> element to start the download
  a.click();

  // Clean up by revoking the URL object to free up resources
  URL.revokeObjectURL(url);
}

export default App;
