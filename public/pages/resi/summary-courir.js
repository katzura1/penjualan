$(document).ready(function () {
  const table = $("#table").DataTable({
    ajax: {
      url: "/resi-product/data-summary-courir",
      data: function (d) {
        d.start_date = $("#start_date").val();
        d.end_date = $("#end_date").val();
      },
    },
    order: [],
    columns: [
      { data: "courir" },
      {
        data: "count_resi",
        render: function (data, type, row) {
          return `
            <button type="button" class="btn btn-primary btn-detail">${data}</button>
          `;
        },
      },
    ],
  });

  $("#start_date, #end_date").on("change", function () {
    table.ajax.reload();
  });

  //btn detail
  $("#table").on("click", ".btn-detail", function () {
    const data = table.row($(this).parents("tr")).data();
    $.ajax({
      url: "/resi-product/data-summary-courir-detail",
      data: {
        courir: data.courir,
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
      },
      beforeSend: function () {
        before_send();
      },
      success: function (res) {
        Swal.close();
        //destroy datatable
        $("#table-detail").DataTable().destroy();

        if (res.data.length > 0) {
          let html = "";
          res.data.forEach((item) => {
            html += `
                <tr>
                    <td>${item.resi_no}</td>
                    <td>${item.courir}</td>
                    <td>${item.register_date}</td>
                    <td>${item.packing_date}</td>
                    <td>${item.shipping_date}</td>
                    <td>${item.received_date}</td>
                </tr>
                `;
          });
          $("#table-detail tbody").html(html);
        } else {
          $("#table-detail tbody").html(
            "<tr><td colspan='6' class='text-center'>No Data</td></tr>"
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
});
