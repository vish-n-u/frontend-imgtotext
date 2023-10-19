
import axios from 'axios'
import { getSingleImageDataIUrl } from '../url'; 
export default async function getSingleImageData(selectedImageId,setSelectedImage,setText,setIsLoading,Toast,onClose){
    const user = JSON.parse(localStorage.getItem("user"));
    try{
        setIsLoading(true)
       const response = await axios.get(getSingleImageDataIUrl + selectedImageId, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    mode:"cors"
  });
        const responseJson = response.data
        console.log("response",response)
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
  