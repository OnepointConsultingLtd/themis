const dedupQuery = [
  {
    $group: {
      _id: {
        name: '$versions.name'
      },
      _idsNeedsToBeDeleted: {
        $push: '$$ROOT._id'
      }
    }
  },
  {
    $project: {
      _id: 0,
      _idsNeedsToBeDeleted: {
        $slice: [
          '$_idsNeedsToBeDeleted',
          1,
          {
            $size: '$_idsNeedsToBeDeleted'
          }
        ]
      }
    }
  },
  {
    $unwind: '$_idsNeedsToBeDeleted'
  },
  {
    $group: {
      _id: '',
      _idsNeedsToBeDeleted: {
        $push: '$_idsNeedsToBeDeleted'
      }
    }
  },
  {
    $project: {
      _id: 0
    }
  }
];


module.exports = dedupQuery;
