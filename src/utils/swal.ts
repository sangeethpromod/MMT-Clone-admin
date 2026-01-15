import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    confirmButtonColor: '#FF2B36',
    background: 'rgba(255, 255, 255, 0.6)',
    color: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.6) blur(4px)',
    width: 'auto',
    heightAuto: true,
    customClass: {
      popup: 'border border-[#e4e4e4] rounded-lg',
    },
    showClass: {
      popup: 'animate-fade-in',
    },
  });
};

export const showErrorAlert = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    confirmButtonColor: '#FF2B36',
    background: 'rgba(255, 255, 255, 0.6)',
    color: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.6) blur(4px)',
    width: 'auto',
    heightAuto: true,
    customClass: {
      popup: 'border border-[#e4e4e4] rounded-lg',
    },
    showClass: {
      popup: 'animate-fade-in',
    },
  });
};

export const showInfoAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    confirmButtonColor: '#FF2B36',
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.6) blur(4px)',
    width: 'auto',
    heightAuto: true,
    customClass: {
      popup: 'border border-[#e4e4e4] rounded-lg',
    },
    showClass: {
      popup: 'animate-fade-in',
    },
  });
};

export { Toast };