import React, { useEffect, useState } from 'react'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Text,
    Input,
    useToast,
    Spinner
  } from '@chakra-ui/react'
import { getSingleImageDataIUrl } from '../url'
// 

  function DrawerExample({setSelectedImage,setText,userHistory}) {
    const user = JSON.parse(localStorage.getItem('user'))
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const [selectedImageId,setSelectedImageId] = useState("")
    const [isLoading,setIsLoading] = useState(false)
    const Toast = useToast()

    useEffect(()=>{
        if(!selectedImageId)return
        else{
            console.log("reachedhere")
            getSingleImageData(selectedImageId,setSelectedImage,setText,setIsLoading,Toast,onClose)
        }


    },[selectedImageId])
  
    return (
      <>
      {user?.email&&  <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
          Saved Images With Text
        </Button>
       } <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Your saved Text from images.</DrawerHeader>
  
            <DrawerBody>
             {
               userHistory?.length > 0?
                userHistory.map((obj)=>{
                    return <Button w="full" overflowX={"clip"} onClick={()=>setSelectedImageId(obj._id)} fontSize={"sm"} my={4} fontWeight={'semibold'} key={obj._id} >{obj.fileName}</Button>
                })
                :<Text>No images with text saved yet</Text>
             }
              {isLoading&&  <Spinner
  thickness='4px'
  speed='0.65s'
  emptyColor='gray.200'
  color='blue.500'
  size='xl'
/>}
            </DrawerBody>
          
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }


async function getSingleImageData(selectedImageId,setSelectedImage,setText,setIsLoading,Toast,onClose){
    const user = JSON.parse(localStorage.getItem("user"));
    try{
        setIsLoading(true)
        const response = await fetch(getSingleImageDataIUrl+selectedImageId,{
            headers:{"Authorization": `Bearer ${user.token}`},
            mode:"cors"
        })
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
           if(url) onClose()
           
    
          } else if(response.status!==500){
            console.error('Image upload failed.');
            return Toast({
              title: responseJson.message,
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
          }
          else{
            return Toast({
              title: "Internal server error refresh and retry",
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
          }

    }
    catch(err){
        console.log(err)
        return Toast({
            status:"error",
            title:"Internal server error, retry and refresh",
            duration: 4000,
          isClosable: true,

        })
    }
}
  

  export default DrawerExample