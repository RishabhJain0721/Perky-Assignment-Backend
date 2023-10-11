import axios from "axios";

const search = async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.get(
      `https://api.travelpayouts.com/data/en/airports.json`
    );
    const filteredData = response.data.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    console.log(filteredData);
    res.status(200).send(filteredData);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: "City not found",
    });
  }
};

export default search;