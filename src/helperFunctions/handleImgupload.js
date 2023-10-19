import { returnImageDataUrl, saveImageUrl } from '../url';

export default  async function handleUpload (selectedImage,setSelectedImage,setText,setIsLoading,Toast,userHistory,setUserHistory)  {
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