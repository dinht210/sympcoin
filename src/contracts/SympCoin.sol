// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13; // Values may be slightly different

contract SympCoin {

    // Since these constants are public, get methods are automatically generated.
    string public constant name = "SympCoin";
    string public constant symbol = "SPH";
    uint8 public constant decimals = 8;
    uint256 public _totalSupply;
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;    

    constructor (uint256 _initialSupply) {
        _balances[msg.sender] = _initialSupply;
        _totalSupply = _initialSupply;
    }
    // You must emit these events when certain triggers occur (see the ERC-20 spec).
    event Approval(address indexed _from, address indexed _to, uint256 _value);
    event Transfer(address indexed _owner, address indexed _spender, uint256
    _value);

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_balances[msg.sender] >= _value);
        require(_to != address(0));
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); 
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public
    returns (bool) {
        require(_balances[msg.sender] >= _value);
        require(_allowances[_from][msg.sender] >= _value);
        require(_to != address(0));
        _balances[_from] -= _value;
        _balances[_to] += _value;
        _allowances[_from][msg.sender] = _allowances[_from][msg.sender] - _value;
        emit Transfer(_from, _to, _value); 
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0));
        _allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns
    (uint) {
        return _allowances[_owner][_spender];
    }

    function mint(address _account, uint256 _amount) public {
        require(_account != address(0));
        _totalSupply += _amount;
        _balances[_account] += _amount;
        emit Transfer(address(0), _account, _amount);
    }
}
