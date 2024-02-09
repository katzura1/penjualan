$(document).ready(function () {
  const table = $("#table").DataTable({
    ajax: {
      url: "/resi-product/data-validasi",
      data: function (d) {
        d.date = $("#date").val();
      },
    },
    order: [],
    columns: [
      {
        data: "resi_no",
      },
      {
        data: "qty_shopee",
      },
      {
        data: "qty_packing",
      },
      {
        data: "percentage_packing",
        width: "5%",
      },
      {
        data: "register_date",
      },
      {
        data: "packing_date",
        render: function (data, type, row) {
          if (data == null) {
            return ``;
          } else {
            return `<button class="btn btn-info btn-status" data-status="packing">${data}</button>`;
          }
        },
      },
      {
        data: "shipping_date",
        render: function (data, type, row) {
          if (data == null) {
            return ``;
          } else {
            return `<button class="btn btn-info btn-status" data-status="shipping">${data}</button>`;
          }
        },
      },
      {
        data: "received_date",
        render: function (data, type, row) {
          if (data == null) {
            return ``;
          } else {
            return `<button class="btn btn-info btn-status" data-status="received">${data}</button>`;
          }
        },
      },
      {
        data: "validated_date",
        render: function (data, type, row) {
          if (data == null) {
            return `<button class="btn btn-primary btn-validasi">Validasi</button>`;
          } else {
            return `<button class="btn btn-primary btn-detail">${data}</button>`;
          }
        },
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
            <button class="btn btn-danger btn-delete">Delete</button>
            <button class="btn btn-secondary btn-view">Detail</button>
          `;
        },
      },
    ],
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excel",
        text: "Export Excel",
        className: "btn btn-success",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7],
        },
      },
    ],
  });

  $("#date").on("change", function () {
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

  $("#table tbody").on("click", ".btn-validasi", function () {
    const data = table.row($(this).parents("tr")).data();

    showDetail(data);
    $("#btn-accept").show();
    $("#btn-reject").show();
  });

  //btn accept store validasi

  $("#btn-accept").on("click", function () {
    const id = $("#modal-validasi #id").val();
    //check id is empty
    if (id == "") {
      show_alert({
        html: "ID tidak boleh kosong",
      });
    }

    const post = () => {
      ajax_post({
        url: "/resi-product/store-validasi",
        data: {
          id: id,
        },
        success: (res) => {
          Swal.close();
          if (res.code == 200) {
            show_success({
              html: res.message,
              type: "success",
            });
            $("#modal-validasi").modal("hide");
            table.ajax.reload();
          } else {
            show_error({
              html: res.message,
            });
          }
        },
      });
    };

    prompt_swal(post, {
      html: "Apakah anda yakin ingin validasi resi ini ?",
    });
  });

  //btn reject reject validasi
  $("#btn-reject").on("click", function () {
    const id = $("#modal-validasi #id").val();
    //check id is empty
    if (id == "") {
      show_alert({
        html: "ID tidak boleh kosong",
      });
    }

    const post = () => {
      ajax_post({
        url: "/resi-product/reject-validasi",
        data: {
          id: id,
        },
        success: (res) => {
          Swal.close();
          if (res.code == 200) {
            show_success({
              html: res.message,
              type: "success",
            });
            $("#modal-validasi").modal("hide");
            table.ajax.reload();
          } else {
            show_error({
              html: res.message,
            });
          }
        },
      });
    };

    prompt_swal(post, {
      html: "Apakah anda yakin ingin reject resi ini ?",
    });
  });

  const showHistory = (resi_no, status) => {
    $.ajax({
      url: "/resi-product/data-history",
      data: {
        resi_no: resi_no,
        status: status,
      },
      success: (res) => {
        if (res.data.length > 0) {
          let html = "";
          res.data.forEach((item) => {
            html += `
              <tr>
                <td>${item.created_at}</td>
                <td>${item.status}</td>
                <td>${item.name}</td>
              </tr>
            `;
          });
          $("#table-detail tbody").html(html);
          $("#modal-detail").modal("show");
        } else {
          $("#table-detail tbody").html("");
          $("#modal-detail").modal("show");
        }
      },
    });
  };
  //btn detail
  $("#table tbody").on("click", ".btn-detail", function () {
    const data = table.row($(this).parents("tr")).data();
    showHistory(data.resi_no, "validated");
  });

  //btn view
  $("#table tbody").on("click", ".btn-view", function () {
    const data = table.row($(this).parents("tr")).data();
    showDetail(data);
    $("#btn-accept").hide();
    $("#btn-reject").hide();
  });

  //btn status
  $("#table tbody").on("click", ".btn-status", function () {
    const data = table.row($(this).parents("tr")).data();
    showHistory(data.resi_no, $(this).data("status"));
  });

  //btn delete using reject validasi url
  $("#table tbody").on("click", ".btn-delete", function () {
    const data = table.row($(this).parents("tr")).data();

    const post = () => {
      ajax_post({
        url: "/resi-product/reject-validasi",
        data: {
          id: data.id,
        },
        success: (res) => {
          Swal.close();
          if (res.code == 200) {
            show_success({
              html: res.message,
              type: "success",
            });
            table.ajax.reload();
          } else {
            show_error({
              html: res.message,
            });
          }
        },
      });
    };

    prompt_swal(post, {
      html: "Apakah anda yakin ingin delete resi ini ?",
    });
  });
});
