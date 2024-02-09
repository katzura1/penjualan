$(document).ready(function () {
  const table = $("#table-resi").DataTable({
    ajax: {
      url: "/resi-product/data-master",
      data: function (d) {
        d.status = "waiting_packing";
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
          <button type="button" class="btn btn-primary btn-packing">Input Packing</button>
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

  //button packing
  $("#table-resi tbody").on("click", ".btn-packing", function () {
    const data = table.row($(this).parents("tr")).data();
    const url = "/resi-product/packing?resi_no=" + data.resi_no;
    const post = () => {
      window.location.href = url;
    };
    prompt_swal(post, {
      html: `Apakah anda yakin ingin memasukan packing untuk resi <b>${data.resi_no}</b>?`,
      confirmButtonText: "Ya, input packing",
    });
  });
});
