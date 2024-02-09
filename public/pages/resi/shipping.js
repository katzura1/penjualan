$(document).ready(function () {
  const checkMode = () => {
    //jika mode_input checked
    //semua input field read only
    //dan jika t idak input tidak read only
    if ($("#mode_input").is(":checked")) {
      $("input").attr("readonly", true);
      // $("button").attr("disabled", true);
      $("select").attr("disabled", true);

      //focus out all input
      $("input").blur();
    } else {
      $("input").attr("readonly", false);
      // $("button").attr("disabled", false);
      $("select").attr("disabled", false);
    }
  };

  const saveResiShipping = () => {
    const resiNo = $("#resi_no").val();
    if (resiNo === "") {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Nomor resi tidak boleh kosong",
      });
      return;
    }

    $.ajax({
      url: "/resi-product/shipping",
      method: "POST",
      data: {
        resi_no: resiNo,
      },
      success: function (response) {
        if (response.code == 200) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: response.message,
          }).then(() => {
            $("#resi_no").val("");
            success_sound.play();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: response.message,
          });
          error_sound.play();
        }
      },
      error: function (xhr) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: xhr.responseJSON.message,
        });
        error_sound.play();
      },
    });
  };

  //event scanner external
  let code = "";
  let reading = false;
  document.addEventListener("keypress", (e) => {
    //usually scanners throw an 'Enter' key at the end of read
    // console.log(code);
    if (e.keyCode === 13) {
      if (code.length > 10) {
        $("#resi_no").val(code);
        saveResiShipping(code);
        /// code ready to use
        code = "";
      }
    } else {
      code += e.key; //while this is not an 'enter' it stores the every key
    }

    //run a timeout of 200ms at the first read and clear everything
    if (!reading) {
      reading = true;
      setTimeout(() => {
        code = "";
        reading = false;
      }, 200); //200 works fine for me but you can adjust it
    }
  });

  //enter on input no resi
  $("#resi_no").on("keyup", function (e) {
    if (e.keyCode === 13) {
      saveResiShipping();
    }
  });

  $("#mode_input").on("change", function () {
    checkMode();
  });

  //check mode
  checkMode();
});
