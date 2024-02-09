$(document).ready(function () {
  const table = $("#table").DataTable({
    ajax: {
      url: "/inventory/data-stock-out",
    },
    order: [],
    columns: [
      {
        data: "received_date_format",
        render: function (data, type, row) {
          return moment(data).format("DD/MM/YYYY");
        },
      },
      {
        data: "total_qty",
        render: function (data, type, row) {
          return `<button type="button" class="btn btn-primary btn-detail">${data}</button>`;
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <button class="btn btn-primary btn-confirm">Acc</button>
          
            <button class="btn btn-danger">Reject</button>
          `;
        },
      },
    ],
  });

  $("#table tbody").on("click", ".btn-detail", function () {
    const data = table.row($(this).parents("tr")).data();

    $.ajax({
      url: "/inventory/data-stock-out-detail",
      method: "GET",
      data: {
        received_date: data.received_date_format,
      },
      beforeSend: function () {
        before_send();
      },
      dataType: "JSON",
      success: function (res) {
        Swal.close();

        //destroy datatable
        $("#table-detail").DataTable().destroy();

        if (res.data.length > 0) {
          let html = "";
          res.data.forEach((item) => {
            html += `
                <tr>
                    <td>${data.received_date_format}</td>
                    <td>${item.barcode}</td>
                    <td>${item.product_name}</td>
                    <td>${item.total_qty}</td>
                </tr>
                `;
          });
          $("#table-detail tbody").html(html);
        } else {
          $("#table-detail tbody").html(
            "<tr><td colspan='3' class='text-center'>No Data</td></tr>"
          );
        }
        //init datatable with export excel
        $("#table-detail").DataTable({
          order: [],
          dom: "Bfrtip",
          buttons: ["excel"],
        });

        $("#modal-detail").modal("show");
      },
    });
  });

  //confirm
  $("#table tbody").on("click", ".btn-confirm", function () {
    const data = table.row($(this).parents("tr")).data();

    const post = () => {
      ajax_post({
        url: "/inventory/confirm-stock-out",
        data: {
          received_date: data.received_date_format,
        },
        success: function (res) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Success Confirm",
          }).then(() => {
            table.ajax.reload();
          });
        },
      });
    };

    prompt_swal(post, {
      html: `Apakah anda ingin menyetujui stock out ini?`,
    });
  });

  //reject
  $("#table tbody").on("click", ".btn-danger", function () {
    const data = table.row($(this).parents("tr")).data();

    const post = () => {
      ajax_post({
        url: "/inventory/reject-stock-out",
        data: {
          received_date: data.received_date_format,
        },
        success: function (res) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Success Reject",
          }).then(() => {
            table.ajax.reload();
          });
        },
      });
    };

    prompt_swal(post, {
      html: `Apakah anda ingin menolak stock out ini?`,
    });
  });
});
