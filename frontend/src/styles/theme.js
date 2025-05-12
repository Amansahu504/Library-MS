export const theme = {
  colors: {
    primary: '#4A4A4A', // Dark grey
    secondary: '#F5F5DC', // Beige
    text: {
      primary: '#4A4A4A',
      secondary: '#4A4A4A/70',
      light: '#F5F5DC',
    },
    background: {
      main: '#F5F5DC',
      card: '#FFFFFF',
      header: '#4A4A4A',
    },
    border: '#4A4A4A/10',
    status: {
      success: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-400',
      },
      error: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-400',
      },
    },
  },
  components: {
    page: {
      container: 'min-h-screen bg-[#F5F5DC] p-6',
      header: 'bg-[#4A4A4A] text-[#F5F5DC] p-6 rounded-lg mb-6',
      title: 'text-2xl font-bold',
    },
    card: 'bg-white shadow-lg rounded-lg p-6 border border-[#4A4A4A]/10',
    input: 'w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20',
    button: {
      primary: 'bg-[#4A4A4A] text-[#F5F5DC] py-2 px-4 rounded hover:bg-[#4A4A4A]/90 transition-colors duration-200',
      secondary: 'bg-[#F5F5DC] text-[#4A4A4A] py-2 px-4 rounded hover:bg-[#F5F5DC]/90 transition-colors duration-200',
      danger: 'bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200',
    },
    table: {
      container: 'overflow-auto',
      base: 'min-w-full divide-y divide-[#4A4A4A]/10',
      header: 'bg-[#4A4A4A]/5',
      headerCell: 'px-6 py-3 text-left text-xs font-medium text-[#4A4A4A] uppercase tracking-wider',
      row: 'hover:bg-[#F5F5DC]/50',
      cell: 'px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]',
    },
    alert: {
      success: 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4',
      error: 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4',
    },
  },
}; 