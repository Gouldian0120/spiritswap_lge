export function getDate(date: number) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  // @ts-ignore
  const dtf = new Intl.DateTimeFormat('en-US', options)
  return dtf.format(date)
}

export function formatPeriodEndDate(date: number) {
  const currentTime = Date.now()
  let difference = date - currentTime
  if (difference < 0) return ''

  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
  difference -= daysDifference * 1000 * 60 * 60 * 24

  const hoursDifference = Math.floor(difference / 1000 / 60 / 60)
  difference -= hoursDifference * 1000 * 60 * 60

  const minutesDifference = Math.floor(difference / 1000 / 60)
  difference -= minutesDifference * 1000 * 60


  const result = `${daysDifference} days ${hoursDifference} hours ${minutesDifference} minutes`

  return result
}
