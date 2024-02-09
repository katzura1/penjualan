$(document).ready(function () {
  let isModeScan = false;

  const table = $("#table-resi").DataTable({
    ajax: {
      url: "/resi-product/data-master",
      data: function (d) {
        d.status = "waiting_shipping";
        d.start_date = $("#start_date").val();
        d.end_date = $("#end_date").val();
      },
      beforeSend: function () {
        before_send();
      },
      complete: function () {
        Swal.close();
      },
    },
    order: [],
    columns: [
      {
        //row number
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
        orderable: false,
      },
      {
        data: "resi_no",
      },
      {
        data: "register_date",
      },
      {
        data: "packing_date",
      },
      {
        data: "resi_product",
        render: function (data, type, row) {
          if (data.length > 0) {
            return data[0].courir;
          } else {
            return "";
          }
        },
      },
      {
        data: "resi_product",
        render: function (data, type, row) {
          return data.length;
        },
      },
      {
        data: "id",
        render: function (data, type, row) {
          //button edit view and history
          return `
            <button type="button" class="btn btn-secondary btn-view">View</button>
            <button type="button" class="btn btn-primary btn-update">Serah Kurir</button>
            `;
        },
        orderable: false,
      },
    ],
    dom: "Bfrtip",
    buttons: [
      //page length
      {
        extend: "pageLength",
      },
      {
        extend: "excel",
        text: "Export Excel",
      },
    ],
  });

  //start or end date change trigger table ajax
  $("#start_date, #end_date").on("change", function () {
    table.ajax.reload();
  });

  const showDetail = (data) => {
    //set id, resi_no, packing_date in modal-validasi
    $("#id").val(data.id);
    $("#resi_no").val(data.resi_no);
    $("#packing_date").val(moment(data.packing_date).format("YYYY-MM-DD"));

    //replace tbody table-shopee with data.resi_products
    let html = "";
    data.resi_product.forEach((item) => {
      html += `
          <tr>
            <td>${item.product.barcode}</td>
            <td>${item.product.name}</td>
            <td>${item.qty}</td>
          </tr>
        `;
    });
    $("#table-shopee tbody").html(html);

    //table-packing
    html = "";
    data.resi_master_detail.forEach((item) => {
      html += `
          <tr>
            <td>${item.product.barcode}</td>
            <td>${item.product.name}</td>
            <td>${item.qty}</td>
          </tr>
        `;
    });
    $("#table-packing tbody").html(html);

    // src image attahment_1 and attachment_2
    $("#attachment_1").attr("src", "/storage/" + data.attachment_1);
    $("#attachment_2").attr("src", "/storage/" + data.attachment_2);

    $("#modal-validasi").modal("show");
  };

  //button view click
  $("#table-resi tbody").on("click", ".btn-view", function () {
    const data = table.row($(this).parents("tr")).data();
    showDetail(data);
  });

  //button update click
  $("#table-resi tbody").on("click", ".btn-update", function () {
    const data = table.row($(this).parents("tr")).data();
    const dataPost = {
      resi_no: data.resi_no,
      type: "shipping",
    };

    const post = () => {
      ajax_post({
        url: "/resi-product/update-date",
        data: dataPost,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: "Data berhasil disimpan",
              didClose: () => {
                table.ajax.reload();
              },
            });
          } else {
            show_error({
              html: result.message ?? "Data gagal disimpan",
            });
          }
        },
      });
    };

    prompt_swal(post, {
      html: `Apakah anda yakin ingin mengubah status resi <b>${data.resi_no}</b> menjadi <b>Serah Kurir</b> ?`,
    });
  });

  $("#btn-scan").on("click", function () {
    isModeScan = true;
    $("#modal-scan").modal("show");
  });

  $("#modal-scan").on("hidden.bs.modal", function (e) {
    isModeScan = false;
    table.ajax.reload();
  });

  //event scanner external
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

    ajax_post({
      url: "/resi-product/shipping",
      data: {
        resi_no: resiNo,
      },
      success: function (response) {
        Swal.close();
        if (response.code == 200) {
          $("#resi_no").val("");
          success_sound.play();
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: response.message,
          });
          error_sound.play();
        }
      },
    });
  };

  let code = "";
  let reading = false;
  document.addEventListener("keypress", (e) => {
    if (!isModeScan) {
      return;
    }
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
});
