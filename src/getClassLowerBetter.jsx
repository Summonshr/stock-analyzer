export default function(v, p1, p2, p3, p4) {
  if (v <= 0) {
    return '';
  }
  if (v < p1) {
    return 'bg-green';
  }
  if (v < p2) {
    return 'bg-green-light';
  }
  if (v < p3) {
    return 'bg-green-lighter';
  }
  if (v < p4) {
    return 'bg-green-lightest';
  }
}