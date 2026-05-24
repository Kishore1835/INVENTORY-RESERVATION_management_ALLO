type Props = {
  status: string
}

export default function StatusBadge({
  status
}: Props) {

  const styles = {

    confirmed:
      "bg-green-500/20 text-green-400 border border-green-500/20",

    expired:
      "bg-red-500/20 text-red-400 border border-red-500/20",

    pending:
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",

    cancelled:
      "bg-gray-500/20 text-gray-400 border border-gray-500/20"
  }

  return (

    <span
      className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
        styles[
          status as keyof typeof styles
        ] || styles.pending
      }`}
    >

      {status}

    </span>
  )
}