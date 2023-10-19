import React, { useEffect, useState } from 'react'
import getSingleImageData from '../helperFunctions/getSingleImgData'
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
           {isLoading&&   <Spinner
              zIndex={'overlay'}
              position={"absolute"}
              top={"50%"}
              left={'16'}
  thickness='4px'
  speed='0.65s'
  emptyColor='gray.200'
  color='blue.500'
  size='xl'
/>
        }      </DrawerBody>
          
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




  export default DrawerExample