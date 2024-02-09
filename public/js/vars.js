const textDelete = {
  html: "Anda ingin menghapus data ini ?",
  confirmButtonText: "Ya, Hapus Data.",
  cancelButtonText: "Batal",
};

const levelUser = $('meta[name="level"]').attr("content");

// Get the current date
const today = new Date();

// Extract the year, month, and day
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Add 1 to the month because it's zero-based
const day = today.getDate().toString().padStart(2, "0");

// Create the formatted date string 'Y-m-d'
const formattedToday = `${year}-${month}-${day}`;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

const error_sound = new Audio("/audio/error.mp3");
const success_sound = new Audio("/audio/success.mp3");

const statusRetur = {
  waiting_check: "Menunggu Pengecekan",
  done_check: "Selesai Pengecekan",
  close: "Close",
};
