$(document).ready(function () {
  let resiData = [];
  let resiNo = "";
  let currentPhoto = "photo1";
  let photo1 = null;
  let photo2 = null;
  //set list of camera
  const videoSelect = document.querySelector("select#videoSource");
  const selectors = [videoSelect];
  const passwordAdmin = $('input[name="password_admin"]').val();
  let isValidPacking = true;

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
    $("#modal-take-photo select").removeAttr("disabled");
  };

  const getResi = (resi_no) => {
    if (resi_no == "") {
      return;
    }
    $.ajax({
      url: "/resi-product/data-detail",
      type: "GET",
      data: {
        resi_no: resi_no,
      },
      dataType: "json",
      beforeSend: function () {
        before_send();
      },
      success: function (result) {
        Swal.close();
        setTimeout(() => {
          //check resiMaster jika tidak ada tampilkan error
          if (result.dataMaster.length > 0) {
            //tampilkan register date data pertama pada error message
            const packing_date = result.dataMaster[0].packing_date;
            //jika packing date != null maka sudah di packing
            if (packing_date != null) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Resi no ${resi_no} sudah di packing pada tanggal ${packing_date}`,
              });

              resiData = [];
              $("#table-list tbody").html("");
              $("#table-detail tbody").html("");
              $("#photo_1").attr("src", "");
              $("#photo_2").attr("src", "");
              photo1 = null;
              photo2 = null;

              error_sound.play();
              return;
            }
          } else {
            // tampilan resi tidak ditemukan dan return
            if (result.data.length == 0) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Resi no ${resi_no} tidak ditemukan!`,
              });

              resiData = [];
              $("#table-list tbody").html("");
              $("#table-detail tbody").html("");
              $("#photo_1").attr("src", "");
              $("#photo_2").attr("src", "");
              photo1 = null;
              photo2 = null;

              error_sound.play();
              return;
            }
          }

          resiData = result.data;
          resiNo = resi_no;
          // replace table-list body with list of data
          $("#table-list tbody").html("");
          result.data.forEach((item) => {
            $("#table-list tbody").append(`

                <tr>
                    <td>${item.barcode}</td>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                </tr>
                `);
          });

          $("#table-detail tbody").html("");
          $("#table-detail tbody").append(rowDetail());
          //focus to latest input barocde[]
          $("input[name='barcode[]']:last").focus();
          success_sound.play();
          checkMode();
        }, 400);
      },
    });
  };

  const rowDetail = () => {
    let html = ``;
    html += `<tr>`;
    html += `
        <td>
        <input type="hidden" name="id_product[]">
        <input type="text" name="barcode[]" class="form-control">
        </td>`;
    html += `
        <td>
        </td>
    `;
    html += `<td>
        <input type="number" name="qty[]" min="1" data-qty="0" data-max="0" class="form-control">
        </td>`;

    html += `
        <td>
            <button type="button" class="btn btn-danger btn-delete">
                Delete
            </button>
        </td>
    `;
    html += `</tr>`;
    return html;
  };

  const gotDevices = (deviceInfos) => {
    // Handles being called several times to update labels. Preserve values.
    var values = selectors.map(function (select) {
      return select.value;
    });
    selectors.forEach(function (select) {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });

    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = document.createElement("option");
      option.value = deviceInfo.deviceId;

      if (deviceInfo.kind === "videoinput") {
        option.text = deviceInfo.label || "camera " + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        console.log("Some other kind of source/device: ", deviceInfo);
      }

      selectors.forEach(function (select, selectorIndex) {
        if (
          Array.prototype.slice.call(select.childNodes).some(function (n) {
            return n.value === values[selectorIndex];
          })
        ) {
          select.value = values[selectorIndex];
        }
      });
    }
  };

  const handleError = (error) => {
    console.log("navigator.getUserMedia error: ", error);
  };

  //event on enter in input nesi_no
  $("input[name=resi_no]").keypress(function (e) {
    // console.log(e.which);
    if (e.which == 13) {
      //get resi no
      const resi_no = $(this).val();
      //get data resi
      getResi(resi_no);
    }
  });

  //event on click btn delete
  $(document).on("click", ".btn-delete", function () {
    $(this).closest("tr").remove();
  });

  const findProduct = async (barcode, row) => {
    //get id product
    let id_product = resiData.find((item) => item.barcode == barcode);

    const setProduct = (id_product) => {
      //set id product
      $(row)
        .closest("tr")
        .find("input[name='id_product[]']")
        .val(id_product.product_id);
      //set name product
      $(row).closest("tr").find("td:eq(1)").text(id_product.name);
      //set max qty
      $(row)
        .closest("tr")
        .find("input[name='qty[]']")
        .attr("data-max", id_product.qty);
      //set qty
      $(row).closest("tr").find("input[name='qty[]']").val(1);
      //set data-qty
      $(row).closest("tr").find("input[name='qty[]']").attr("data-qty", 1);
      //focus to latest input qty[]
      $("input[name='qty[]']:last").focus();
    };
    // console.log(id_product);
    //check if id product not found
    if (!id_product) {
      //searching from ajax product/data-detail
      let valid = false;
      await $.ajax({
        url: "/product/data-detail",
        type: "GET",
        data: {
          barcode: barcode,
        },
        dataType: "json",
        beforeSend: function () {
          before_send();
        },
        success: function (result) {
          Swal.close();
          //check if product found
          if (result.data.length > 0) {
            //confirm password admin
            id_product = {
              product_id: result.data[0].id,
              name: result.data[0].name,
              qty: 1,
            };
            valid = true;
          }
        },
      });
      //if product not found
      if (!valid) {
        console.log("masuk");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Barcode tidak ditemukan!",
        });
        return;
      } else {
        //confirm password admin
        // confirmPasswordAdmin(passwordAdmin, () => {
        //   setTimeout(() => {
        setProduct(id_product);
        isValidPacking = false;
        //   }, 400);
        // });
      }
    } else {
      setProduct(id_product);
    }
  };

  //event on enter on barcode input
  $(document).on("keypress", "input[name='barcode[]']", function (e) {
    if (e.which == 13) {
      //get barcode
      const barcode = $(this).val();

      //check if barcode already in other row excep this row
      const barcode_exist = $("input[name='barcode[]']")
        .not(this)
        .filter(function () {
          return this.value == barcode;
        }).length;

      if (barcode_exist > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Barcode already exist!",
        });
        return;
      }

      //find product
      findProduct(barcode, this);
    }
  });

  //event on enter qty, check qty max
  let modePassword = false;
  $(document).on("keypress", "input[name='qty[]']", function (e) {
    if (e.which == 13) {
      //jika kosong tidak lanjutkan code dibawah
      if (!$(this).val() || $(this).val() == "0") {
        return;
      }
      //get qty and parse to int
      const qty = parseInt($(this).val());
      //get max qty
      const max_qty = parseInt($(this).data().max);

      const set_qty = (qty) => {
        //update data-qty
        $(this).attr("data-qty", qty);

        //if this last input qty[] add new row
        if ($(this).closest("tr").is(":last-child")) {
          $("#table-detail tbody").append(rowDetail());

          //focus to latest input barcode[]
          $("input[name='barcode[]']:last").focus();
        }
      };
      //check qty
      if (qty > max_qty) {
        //minta password admin untuk melanjutkan
        modePassword = true;
        // confirmPasswordAdmin(passwordAdmin, () => {
        set_qty(qty);
        isValidPacking = false;
        // });
      } else {
        set_qty(qty);
      }

      modePassword = false;
    }
  });

  //if qty not enter and focus to other input set it to data qty
  $(document).on("focusout", "input[name='qty[]']", function () {
    if (!modePassword) {
      //get qty
      const qty = $(this).attr("data-qty");
      console.log(qty);
      //set data qty as value
      $(this).val(qty);
    }
  });
  //show modal btn-take-photo-1
  $("#btn-take-photo-1").click(function () {
    Webcam.attach("#video");
    currentPhoto = "photo1";
    $("#modal-take-photo").modal("show");
  });

  //show modal btn-take-photo-2
  $("#btn-take-photo-2").click(function () {
    Webcam.attach("#video");
    currentPhoto = "photo2";
    $("#modal-take-photo").modal("show");
  });

  //on hide modal reset webcam
  $("#modal-take-photo").on("hidden.bs.modal", function () {
    Webcam.reset("#video");
  });

  //event on change video source
  $("#videoSource").change(function () {
    Webcam.set("constraints", {
      width: 400,
      height: 400,
      image_format: "jpeg",
      jpeg_quality: 70,
      deviceId: { exact: $(this).val() },
    });
    Webcam.reset();
    Webcam.attach("#video");
  });

  $("#btn-take-photo").click(function () {
    Webcam.snap(function (data_uri) {
      if (currentPhoto == "photo1") {
        photo1 = data_uri;
        document.getElementById("photo_1").src = data_uri;
      }
      if (currentPhoto == "photo2") {
        photo2 = data_uri;
        document.getElementById("photo_2").src = data_uri;
      }

      //   console.log(data_uri);
    });
    //close modal
    $("#modal-take-photo").modal("hide");
  });

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

  //start the camera from video source
  Webcam.set({
    width: 400,
    height: 400,
    image_format: "jpeg",
    jpeg_quality: 70,
    sourceId: $("#videoSource").val(),
  });

  $("#btn-save").on("click", function () {
    //get data resi
    const resi_no = $("input[name='resi_no']").val();
    //validasi resi no
    if (!resi_no) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Resi no harus diisi!",
      });
      return;
    }

    //check id_produk pada baris terakhir, jika kosong hapus baris
    const id_product_last = $("input[name='id_product[]']:last").val();
    if (!id_product_last) {
      $("input[name='id_product[]']:last").closest("tr").remove();
    }

    //get data product
    const id_product = $("input[name='id_product[]']")
      .map(function () {
        return $(this).val();
      })
      .get();
    const barcode = $("input[name='barcode[]']")
      .map(function () {
        return $(this).val();
      })
      .get();
    const qty = $("input[name='qty[]']")
      .map(function () {
        return $(this).val();
      })
      .get();

    //validasi product minimal 1 dan qty tidak boleh ada yang 0
    let valid = true;
    if (id_product.length == 0) {
      valid = false;
    }
    qty.forEach((item) => {
      if (item == 0) {
        valid = false;
      }
    });

    //validasi photo 1 required
    if (!photo1 || photo1 == null || photo1 == undefined || photo1 == "") {
      valid = false;
    }

    if (!valid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Produk, qty dan photo 1 harus diisi!",
      });
      return;
    }

    const post = () => {
      //show confirmation dialog
      Swal.fire({
        title: "Perhatian",
        text: "Apakah anda ingin menyimpan data ini?",
        icon: "warning",
        confirmButtonColor: "#206bc4",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          //save data
          const data = {
            resi_no: resi_no,
            product_id: id_product,
            barcode: barcode,
            qty: qty,
            attachment_1: photo1,
            attachment_2: photo2,
          };

          $.ajax({
            url: "/resi-product/packing",
            type: "POST",
            data: data,
            dataType: "json",
            beforeSend: function () {
              before_send();
            },
            success: function (result) {
              Swal.close();
              setTimeout(() => {
                if (result.code == 200) {
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: result.message,
                  });
                  setTimeout(() => {
                    success_sound.play();
                  }, 400);
                  //reload page
                  location.reload();
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: result.message,
                  });
                  error_sound.play();
                }
              }, 400);
            },
            error: function (xhr, status, error) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                html: xhr.responseText,
              });
              error_sound.play();
            },
          });
        }
      });
    };

    if (!isValidPacking) {
      //confirm password admin
      confirmPasswordAdmin(passwordAdmin, () => {
        setTimeout(() => {
          post();
        }, 400);
      });
    } else {
      post();
    }
  });

  //event scanner external
  let code = "";
  let reading = false;
  document.addEventListener("keypress", (e) => {
    //usually scanners throw an 'Enter' key at the end of read
    // console.log(code);
    if (e.keyCode === 13) {
      if (code.length > 10) {
        //set check mode checked
        $("#mode_input").prop("checked", true);

        //jika resiNo tidak kosong maka panggila getResi
        if (resiNo == "") {
          $("input[name='resi_no']").val(code);
          getResi(code);
        } else {
          //jika resiNo tidak kosong maka panggila findProduct

          //cek apakah barcode sudah ada atau belum
          const barcode_exist = $("input[name='barcode[]']").filter(
            function () {
              return this.value == code;
            }
          ).length;
          console.log("barcode_exist", barcode_exist);
          if (barcode_exist > 0) {
            //cek id product pada row yang sama apakah ada isi atau tidak
            const selectedProduct = $("input[name='barcode[]']").filter(
              function () {
                return this.value == code;
              }
            );
            const id_product = selectedProduct
              .closest("tr")
              .find('input[name="id_product[]"]')
              .val();
            console.log("id_product", id_product);
            if (id_product == "") {
              findProduct(code, $("input[name='barcode[]']:last"));
            } else {
              //ambil nilai qty dari baris yang sama dengan barcode
              const qty = selectedProduct
                .closest("tr")
                .find('input[name="qty[]"]')
                .val();

              // qty baru + 1
              const new_qty = parseInt(qty) + 1;

              //get max qty
              const max_qty = selectedProduct
                .closest("tr")
                .find('input[name="qty[]"]')
                .attr("data-max");

              // jika lebih dari max qty minta password admin
              if (new_qty > max_qty) {
                //minta password admin untuk melanjutkan
                // confirmPasswordAdmin(passwordAdmin, () => {
                //update qty
                selectedProduct
                  .closest("tr")
                  .find('input[name="qty[]"]')
                  .val(new_qty);
                //update data-qty
                selectedProduct
                  .closest("tr")
                  .find('input[name="qty[]"]')
                  .attr("data-qty", new_qty);
                isValidPacking = false;
                // });
              } else {
                //update qty
                selectedProduct
                  .closest("tr")
                  .find('input[name="qty[]"]')
                  .val(new_qty);
                //update data-qty
                selectedProduct
                  .closest("tr")
                  .find('input[name="qty[]"]')
                  .attr("data-qty", new_qty);
              }
            }
          } else {
            //jika id_product terakhir kosong gunakan row terakhir
            //jika tidak add dahulu baru gunakan row terakhir

            const id_product_last = $("input[name='id_product[]']:last").val();
            if (!id_product_last || id_product_last == "") {
              findProduct(code, $("input[name='barcode[]']:last"));
            } else {
              $("#table-detail tbody").append(rowDetail());
              findProduct(code, $("input[name='barcode[]']:last"));
            }
            //set nilai barcode
            $("input[name='barcode[]']:last").val(code);
          }
          checkMode();
          $('input[name="password_admin"]').removeAttr("readonly");
        }

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

  $("#mode_input").on("change", function () {
    checkMode();
  });

  //check mode
  checkMode();

  const checkResiNo = () => {
    const resi_no = $("input[name='resi_no']").val();
    if (resi_no.length > 10) {
      getResi(resi_no);
    }
  };

  checkResiNo();
});
