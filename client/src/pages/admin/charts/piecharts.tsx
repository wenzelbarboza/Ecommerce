import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
// import data1 from "../../../assets/data.json";
import { usePieChart } from "../../../api/stats.api";
import { pieChartApiReturn } from "../../../types/api.types";

const PieCharts = () => {
  const { data: pieData, isLoading, isError, error } = usePieChart();

  const data = pieData?.data as pieChartApiReturn;

  if (isError) return <h1>error in loading data</h1>;
  if (isLoading) return <h1>loading...</h1>;

  // const data = pieData ?? []
  console.log(data);
  console.log("this is order fulfillment ratio", data.orderFullfillmentStatus);

  console.log(
    "this is the catagory value",
    Object.keys(data.categoryPercentage ?? []).map(
      (i) => data.categoryPercentage[i],
    ),
  );

  console.log("printing categoryPercentagey");

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        <section>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[
                data.orderFullfillmentStatus.ordersPrcessing ?? 0,
                data.orderFullfillmentStatus.ordersDelivered ?? 0,
                data.orderFullfillmentStatus.ordersShipped ?? 0,
              ]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={Object.keys(data.categoryPercentage ?? [])}
              data={Object.keys(data.categoryPercentage ?? []).map(
                (i) => data.categoryPercentage[i],
              )}
              backgroundColor={Object.keys(data.categoryPercentage ?? []).map(
                (i) =>
                  `hsl(${data.categoryPercentage[i] * Math.random() * 4}, ${data.categoryPercentage[i]}%, 50%)`,
              )}
              // backgroundColor={data1 .categories.map(
              //   (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
              // )}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[
                data.inventoryCount.inStock,
                data.inventoryCount.outOfStock,
              ]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          </div>
          <h2> Stock Availability</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={Object.keys(data.revenueDistribution)}
              data={Object.keys(data.revenueDistribution).map(
                (key) => data.revenueDistribution[key],
              )}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          </div>
          <h2>Revenue Distribution</h2>
        </section>

        <section>
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[
                data.ageDistribution.teen,
                data.ageDistribution.audult,
                data.ageDistribution.old,
              ]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Users Age Group</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[data.adminCustomer.admin, data.adminCustomer.customer]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PieCharts;
