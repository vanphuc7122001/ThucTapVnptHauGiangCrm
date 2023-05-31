import Swal from "sweetalert2";

export default function(){
    const showSuccess = () => {
        
        Swal.fire({
          title: "Success",
          icon: "success",
          confirmButtonText: "OK",
          showCloseButton: true,
        });
      };
      const showDelete = () => {
        
        Swal.fire({
          title: 'Do you want to delete?',
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Delete',
          confirmButtonColor: '#cc0000'
          // denyButtonText: `Delete`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire('Deleted!', '', 'success')
          } 
        })
      };
      return {showSuccess,showDelete}
}