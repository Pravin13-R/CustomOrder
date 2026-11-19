import { formatMoney } from "../utils/formatMoney";


const Price = ({ amount }) => <span className="price">{formatMoney(amount)}</span>;

export default Price;