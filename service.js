const generateId = () => {
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
    return maxId + 1;
}

module.exports = generateId();
export {generateId};