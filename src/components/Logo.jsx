import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export default function Logo() {
  return <Link to="/" className="logo"><span><Droplets size={20}/></span>Jal Sanskriti</Link>;
}
